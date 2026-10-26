package com.pokenexus.team.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.common.exception.NotFoundException;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.pokedex.service.PokemonQueryService;
import com.pokenexus.synergy.service.SynergyAnalyzer;
import com.pokenexus.team.dto.CreateTeamRequest;
import com.pokenexus.team.dto.TeamMemberRequest;
import com.pokenexus.team.dto.TeamResponse;
import com.pokenexus.team.entity.Team;
import com.pokenexus.team.mapper.TeamMapper;
import com.pokenexus.team.repository.TeamRepository;

@Service
public class TeamService {

    public static final int MAX_SHARE_CODE_ATTEMPTS = 3;
    public static final int SCORED_MEMBERS = SynergyAnalyzer.MAX_TEAM_SIZE;

    private static final int SCORE_SCALE = 2;

    private final TeamRepository teamRepository;
    private final PokemonQueryService pokemonQueryService;
    private final SynergyAnalyzer synergyAnalyzer;
    private final ShareCodeGenerator shareCodeGenerator;
    private final TeamMapper teamMapper;
    private final Clock clock;

    @Autowired
    public TeamService(TeamRepository teamRepository, PokemonQueryService pokemonQueryService,
                       SynergyAnalyzer synergyAnalyzer, ShareCodeGenerator shareCodeGenerator, TeamMapper teamMapper) {
        this(teamRepository, pokemonQueryService, synergyAnalyzer, shareCodeGenerator, teamMapper, Clock.systemUTC());
    }

    TeamService(TeamRepository teamRepository, PokemonQueryService pokemonQueryService,
                SynergyAnalyzer synergyAnalyzer, ShareCodeGenerator shareCodeGenerator, TeamMapper teamMapper,
                Clock clock) {
        this.teamRepository = teamRepository;
        this.pokemonQueryService = pokemonQueryService;
        this.synergyAnalyzer = synergyAnalyzer;
        this.shareCodeGenerator = shareCodeGenerator;
        this.teamMapper = teamMapper;
        this.clock = clock;
    }

    @Transactional
    public TeamResponse create(CreateTeamRequest request) {
        List<TeamMemberRequest> members = request.members().stream()
                .sorted(Comparator.comparingInt(TeamMemberRequest::slot))
                .toList();
        requireDistinct(members.stream().map(TeamMemberRequest::slot).toList(),
                ErrorCode.DUPLICATE_SLOT, "Each slot can be used only once in a team");
        List<Integer> pokemonIds = members.stream().map(TeamMemberRequest::pokemonId).toList();
        requireDistinct(pokemonIds, ErrorCode.DUPLICATE_POKEMON, "A team cannot contain the same Pokémon twice");

        Map<Integer, PokemonRef> pokemonById = pokemonQueryService.findRefs(pokemonIds);
        List<Integer> unknown = pokemonIds.stream().filter(id -> !pokemonById.containsKey(id)).toList();
        if (!unknown.isEmpty()) {
            throw new ApiException(ErrorCode.UNKNOWN_POKEMON, "Unknown Pokémon id(s): " + unknown);
        }

        double teamScore = synergyAnalyzer.analyze(pokemonIds.subList(0, Math.min(SCORED_MEMBERS, pokemonIds.size())))
                .teamScore();
        Team team = new Team(request.name(), nextFreeShareCode(),
                BigDecimal.valueOf(teamScore).setScale(SCORE_SCALE, RoundingMode.HALF_UP),
                LocalDateTime.now(clock).truncatedTo(ChronoUnit.SECONDS));
        members.forEach(member -> team.addMember(member.slot(), member.pokemonId(), member.nickname()));
        return teamMapper.toResponse(teamRepository.save(team), pokemonById);
    }

    @Transactional(readOnly = true)
    public TeamResponse findByShareCode(String shareCode) {
        if (!ShareCodeGenerator.isValid(shareCode)) {
            throw new ApiException(ErrorCode.INVALID_PARAMETER, "shareCode must match ^[A-Za-z0-9]{8}$");
        }
        Team team = teamRepository.findByShareCode(shareCode)
                .orElseThrow(() -> new NotFoundException(ErrorCode.TEAM_NOT_FOUND,
                        "Team '" + shareCode + "' not found"));
        List<Integer> pokemonIds = team.getMembers().stream().map(member -> member.getPokemonId()).toList();
        return teamMapper.toResponse(team, pokemonQueryService.findRefs(pokemonIds));
    }

    private String nextFreeShareCode() {
        for (int attempt = 0; attempt < MAX_SHARE_CODE_ATTEMPTS; attempt++) {
            String candidate = shareCodeGenerator.next();
            if (!teamRepository.existsByShareCode(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Could not generate a unique share code after "
                + MAX_SHARE_CODE_ATTEMPTS + " attempts");
    }

    private static void requireDistinct(List<Integer> values, ErrorCode errorCode, String detail) {
        Set<Integer> seen = new HashSet<>();
        for (Integer value : values) {
            if (!seen.add(value)) {
                throw new ApiException(errorCode, detail);
            }
        }
    }
}
