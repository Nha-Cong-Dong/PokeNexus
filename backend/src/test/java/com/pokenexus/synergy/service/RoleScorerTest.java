package com.pokenexus.synergy.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.pokenexus.synergy.model.PlayStyle;
import com.pokenexus.synergy.model.PokemonProfile;
import com.pokenexus.synergy.model.TeamStatProfile;
import com.pokenexus.synergy.service.RoleScorer.RoleFit;

class RoleScorerTest {

    private final PokemonProfileRegistry registry = SynergyFixture.registry(SynergyFixture.typeChart());
    private final RoleScorer scorer = new RoleScorer();

    @Test
    void computesMaximumLevelFiftySpeed() {
        assertThat(RoleScorer.maxLevel50Speed(100)).isEqualTo(167);
        assertThat(RoleScorer.maxLevel50Speed(130)).isEqualTo(200);
        assertThat(RoleScorer.maxLevel50Speed(60)).isEqualTo(123);
        assertThat(RoleScorer.maxLevel50Speed(0)).isEqualTo(57);
    }

    @Test
    void balanceRewardsASpecialAttackerForAPhysicalTeam() {
        TeamStatProfile physicalTeam = TeamStatProfile.of(profiles(445, 530, 130));

        RoleFit vaporeon = scorer.score(profile(134), physicalTeam, PlayStyle.BALANCE);
        RoleFit tyranitar = scorer.score(profile(248), physicalTeam, PlayStyle.BALANCE);

        assertThat(physicalTeam.specialAttackers()).isZero();
        assertThat(vaporeon.reasons())
                .contains("Bù sát thương đặc biệt (Tấn công đặc biệt 110) cho đội đang thiên về vật lý");
        assertThat(tyranitar.reasons()).noneMatch(reason -> reason.startsWith("Bù sát thương"));
    }

    @Test
    void balanceAsksForSpeedOnlyWhenTheTeamHasNoFastMember() {
        TeamStatProfile slowTeam = TeamStatProfile.of(profiles(260, 248, 376));
        TeamStatProfile fastTeam = TeamStatProfile.of(profiles(135, 26, 376));

        RoleFit forSlowTeam = scorer.score(profile(135), slowTeam, PlayStyle.BALANCE);
        RoleFit forFastTeam = scorer.score(profile(135), fastTeam, PlayStyle.BALANCE);

        assertThat(forSlowTeam.reasons())
                .contains("Tốc độ gốc 130 (tối đa 200 ở cấp 50): đội chưa có thành viên nhanh");
        assertThat(forFastTeam.reasons()).noneMatch(reason -> reason.contains("chưa có thành viên nhanh"));
        assertThat(forSlowTeam.value()).isGreaterThan(forFastTeam.value());
    }

    @Test
    void trickRoomPrefersSlowHardHitters() {
        TeamStatProfile team = TeamStatProfile.of(profiles(260));

        double swampert = scorer.score(profile(260), team, PlayStyle.TRICK_ROOM).value();
        double jolteon = scorer.score(profile(135), team, PlayStyle.TRICK_ROOM).value();

        assertThat(swampert).isGreaterThan(jolteon);
    }

    @Test
    void handlesAnEmptyTeamProfile() {
        TeamStatProfile empty = TeamStatProfile.of(List.of());

        RoleFit fit = scorer.score(profile(445), empty, PlayStyle.BALANCE);

        assertThat(empty.attackSkew()).isZero();
        assertThat(fit.value()).isBetween(0.0, 1.0);
    }

    private PokemonProfile profile(int id) {
        return registry.find(id).orElseThrow();
    }

    private List<PokemonProfile> profiles(int... ids) {
        return Arrays.stream(ids).mapToObj(this::profile).toList();
    }
}
