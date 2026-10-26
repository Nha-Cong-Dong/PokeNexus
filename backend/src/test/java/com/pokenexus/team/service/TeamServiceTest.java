package com.pokenexus.team.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.pokedex.service.PokemonQueryService;
import com.pokenexus.synergy.dto.AnalyzeResponse;
import com.pokenexus.synergy.service.SynergyAnalyzer;
import com.pokenexus.team.dto.CreateTeamRequest;
import com.pokenexus.team.dto.TeamMemberRequest;
import com.pokenexus.team.dto.TeamResponse;
import com.pokenexus.team.entity.Team;
import com.pokenexus.team.mapper.TeamMapper;
import com.pokenexus.team.repository.TeamRepository;

class TeamServiceTest {

    private static final Instant NOW = Instant.parse("2026-11-06T09:30:00.750Z");
    private static final List<PokemonRef> POKEDEX = List.of(
            new PokemonRef(6, "charizard", List.of("fire", "flying")),
            new PokemonRef(130, "gyarados", List.of("water", "flying")),
            new PokemonRef(149, "dragonite", List.of("dragon", "flying")),
            new PokemonRef(663, "talonflame", List.of("fire", "flying")),
            new PokemonRef(637, "volcarona", List.of("bug", "fire")),
            new PokemonRef(530, "excadrill", List.of("ground", "steel")));

    private final TeamRepository teamRepository = mock(TeamRepository.class);
    private final PokemonQueryService pokemonQueryService = mock(PokemonQueryService.class);
    private final SynergyAnalyzer synergyAnalyzer = mock(SynergyAnalyzer.class);
    private final ShareCodeGenerator shareCodeGenerator = mock(ShareCodeGenerator.class);
    private final TeamService teamService = new TeamService(teamRepository, pokemonQueryService, synergyAnalyzer,
            shareCodeGenerator, new TeamMapper(), Clock.fixed(NOW, ZoneOffset.UTC));

    @BeforeEach
    void setUp() {
        when(pokemonQueryService.findRefs(any())).thenAnswer(invocation -> {
            List<Integer> ids = List.copyOf(invocation.getArgument(0));
            return POKEDEX.stream().filter(ref -> ids.contains(ref.id()))
                    .collect(Collectors.toMap(PokemonRef::id, Function.identity()));
        });
        when(teamRepository.save(any(Team.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(shareCodeGenerator.next()).thenReturn("a1B2c3D4");
    }

    @Test
    void savesTeamOrderedBySlotAndScoresTheFirstFiveMembers() {
        when(synergyAnalyzer.analyze(List.of(6, 130, 149, 663, 637))).thenReturn(analysisWithScore(20.0));
        CreateTeamRequest request = new CreateTeamRequest("  Rain Team  ", List.of(
                new TeamMemberRequest(6, 530, "Drill"),
                new TeamMemberRequest(2, 130, "Gyara"),
                new TeamMemberRequest(1, 6, null),
                new TeamMemberRequest(3, 149, ""),
                new TeamMemberRequest(4, 663, "  "),
                new TeamMemberRequest(5, 637, " Moth ")));

        TeamResponse response = teamService.create(request);

        assertThat(response.shareCode()).isEqualTo("a1B2c3D4");
        assertThat(response.name()).isEqualTo("Rain Team");
        assertThat(response.synergyScore()).isEqualTo(20.0);
        assertThat(response.createdAt()).isEqualTo(Instant.parse("2026-11-06T09:30:00Z"));
        assertThat(response.members()).extracting(TeamResponse.Member::slot).containsExactly(1, 2, 3, 4, 5, 6);
        assertThat(response.members()).extracting(TeamResponse.Member::name)
                .containsExactly("charizard", "gyarados", "dragonite", "talonflame", "volcarona", "excadrill");
        assertThat(response.members()).extracting(TeamResponse.Member::nickname)
                .containsExactly(null, "Gyara", null, null, "Moth", "Drill");
        ArgumentCaptor<Team> saved = ArgumentCaptor.forClass(Team.class);
        verify(teamRepository).save(saved.capture());
        assertThat(saved.getValue().getSynergyScore()).isEqualByComparingTo(new BigDecimal("20.00"));
        assertThat(saved.getValue().getMembers()).hasSize(6);
    }

    @Test
    void scoresSingleMemberTeam() {
        when(synergyAnalyzer.analyze(List.of(6))).thenReturn(analysisWithScore(76.0));

        TeamResponse response = teamService.create(
                new CreateTeamRequest("Solo", List.of(new TeamMemberRequest(1, 6, null))));

        assertThat(response.synergyScore()).isEqualTo(76.0);
    }

    @Test
    void rejectsDuplicateSlotDuplicatePokemonAndUnknownPokemon() {
        assertError(new CreateTeamRequest("T", List.of(new TeamMemberRequest(1, 6, null),
                new TeamMemberRequest(1, 130, null))), ErrorCode.DUPLICATE_SLOT);
        assertError(new CreateTeamRequest("T", List.of(new TeamMemberRequest(1, 6, null),
                new TeamMemberRequest(2, 6, null))), ErrorCode.DUPLICATE_POKEMON);
        assertError(new CreateTeamRequest("T", List.of(new TeamMemberRequest(1, 6, null),
                new TeamMemberRequest(2, 99999, null))), ErrorCode.UNKNOWN_POKEMON);
        verify(teamRepository, never()).save(any());
    }

    @Test
    void retriesShareCodeOnCollision() {
        when(synergyAnalyzer.analyze(List.of(6))).thenReturn(analysisWithScore(76.0));
        when(shareCodeGenerator.next()).thenReturn("AAAAAAAA", "BBBBBBBB");
        when(teamRepository.existsByShareCode("AAAAAAAA")).thenReturn(true);

        TeamResponse response = teamService.create(
                new CreateTeamRequest("T", List.of(new TeamMemberRequest(1, 6, null))));

        assertThat(response.shareCode()).isEqualTo("BBBBBBBB");
    }

    @Test
    void givesUpAfterThreeCollisions() {
        when(synergyAnalyzer.analyze(List.of(6))).thenReturn(analysisWithScore(76.0));
        when(teamRepository.existsByShareCode(anyString())).thenReturn(true);

        assertThatThrownBy(() -> teamService.create(
                new CreateTeamRequest("T", List.of(new TeamMemberRequest(1, 6, null)))))
                .isInstanceOf(IllegalStateException.class);
        verify(teamRepository, never()).save(any());
    }

    @Test
    void validatesShareCodeBeforeLookingItUp() {
        assertThatThrownBy(() -> teamService.findByShareCode("abc"))
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.errorCode()).isEqualTo(ErrorCode.INVALID_PARAMETER));
        when(teamRepository.findByShareCode("ZZZZZZZZ")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> teamService.findByShareCode("ZZZZZZZZ"))
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.errorCode()).isEqualTo(ErrorCode.TEAM_NOT_FOUND));
    }

    private void assertError(CreateTeamRequest request, ErrorCode expected) {
        assertThatThrownBy(() -> teamService.create(request))
                .isInstanceOfSatisfying(ApiException.class, ex -> assertThat(ex.errorCode()).isEqualTo(expected));
    }

    private static AnalyzeResponse analysisWithScore(double teamScore) {
        return new AnalyzeResponse(List.of(), teamScore, List.of(),
                new AnalyzeResponse.OffensiveCoverage(0, List.of()),
                new AnalyzeResponse.StatRadar(0, 0, 0, 0, 0, 0));
    }
}
