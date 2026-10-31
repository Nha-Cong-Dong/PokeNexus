package com.pokenexus.synergy.service;

import static com.pokenexus.synergy.service.SynergyFixture.EXAMPLE_TEAM;
import static com.pokenexus.synergy.service.SynergyFixture.EXAMPLE_TEAM_WITH_SIXTH;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.synergy.dto.RecommendationRequest;
import com.pokenexus.synergy.dto.RecommendationResponse;
import com.pokenexus.synergy.dto.RecommendationResponse.Recommendation;
import com.pokenexus.synergy.model.PlayStyle;
import com.pokenexus.typechart.service.TypeChartService;

class RecommendationEngineTest {

    private static final Set<Integer> NOT_FULLY_EVOLVED_OR_SPECIAL_FORMS = Set.of(4, 10034, 10058);

    private final TypeChartService typeChart = SynergyFixture.typeChart();
    private final PokemonProfileRegistry registry = SynergyFixture.registry(typeChart);
    private final RecommendationEngine engine = new RecommendationEngine(
            new SynergyAnalyzer(registry, new TeamInsightBuilder()), registry, new ReasonBuilder(), new RoleScorer());

    @Test
    void topRecommendationAddressesRockWeaknessFromSpecExampleTwo() {
        RecommendationResponse response = engine.recommend(new RecommendationRequest(EXAMPLE_TEAM, null, null, null, null));

        assertThat(response.items()).hasSize(3);
        Recommendation top = response.items().getFirst();
        assertThat(top.reasons()).anySatisfy(reason -> assertThat(reason).contains("Rock"));
        assertThat(top.reasons().getFirst())
                .isEqualTo("Kháng hệ Rock (x0,25): đội đang có 5 thành viên yếu, chưa ai kháng");
    }

    @Test
    void returnsFullyEvolvedDistinctTypeCombinationsOutsideTheTeam() {
        RecommendationResponse response = engine.recommend(new RecommendationRequest(EXAMPLE_TEAM, 10, false, null, null));

        assertThat(response.candidateCount()).isEqualTo(13);
        assertThat(response.items()).hasSize(10);
        assertThat(response.items()).extracting(Recommendation::id)
                .doesNotContainAnyElementsOf(EXAMPLE_TEAM)
                .doesNotContainAnyElementsOf(NOT_FULLY_EVOLVED_OR_SPECIAL_FORMS);
        Set<Set<String>> combinations = new HashSet<>();
        response.items().forEach(item -> assertThat(combinations.add(Set.copyOf(item.types()))).isTrue());
        assertThat(response.items()).extracting(Recommendation::name)
                .contains("garchomp", "mewtwo")
                .doesNotContain("flygon", "mew");
    }

    @Test
    void ranksByWeightedScoreWithNormalizedBreakdown() {
        RecommendationResponse response = engine.recommend(new RecommendationRequest(EXAMPLE_TEAM, 3, false, null, null));

        assertThat(response.items()).extracting(Recommendation::name)
                .containsExactly("excadrill", "garchomp", "metagross");
        assertThat(response.playStyle()).isEqualTo(PlayStyle.BALANCE);
        Recommendation excadrill = response.items().getFirst();
        assertThat(excadrill.score()).isEqualTo(79.4);
        assertThat(excadrill.baseStatTotal()).isEqualTo(508);
        assertThat(excadrill.breakdown().defense()).isEqualTo(1.0);
        assertThat(excadrill.breakdown().offense()).isEqualTo(1.0);
        assertThat(excadrill.breakdown().role()).isEqualTo(0.703);
        assertThat(excadrill.breakdown().stats()).isEqualTo(0.118);
        assertThat(excadrill.reasons()).containsExactly(
                "Kháng hệ Rock (x0,25): đội đang có 5 thành viên yếu, chưa ai kháng",
                "Miễn nhiễm hệ Electric: đội đang có 3 thành viên yếu, chưa ai kháng",
                "Đánh siêu hiệu quả hệ Poison, Electric, Fairy mà đội chưa phủ được");
        assertThat(excadrill.cautions()).containsExactly("Thêm điểm yếu hệ Water: đội đã có 3 thành viên yếu");
        assertThat(response.items().get(1).cautions()).isEmpty();
        assertThat(response.items()).extracting(Recommendation::score).isSortedAccordingTo((a, b) -> Double.compare(b, a));
    }

    @Test
    void hyperOffenseKeepsFastCandidatesAndExplainsSpeed() {
        RecommendationResponse response = engine.recommend(
                new RecommendationRequest(EXAMPLE_TEAM, 3, false, null, PlayStyle.HYPER_OFFENSE));

        assertThat(response.playStyle()).isEqualTo(PlayStyle.HYPER_OFFENSE);
        assertThat(response.candidateCount()).isEqualTo(9);
        assertThat(response.items()).extracting(Recommendation::name).containsExactly("mewtwo", "excadrill", "garchomp");
        assertThat(response.items().getFirst().reasons()).first()
                .isEqualTo("Tốc độ gốc 130 (tối đa 200 ở cấp 50) và Tấn công đặc biệt 154: đánh trước, đánh mạnh");
        assertThat(response.items().get(1).reasons()).contains("Tấn công 135: sát thương lớn");
    }

    @Test
    void trickRoomKeepsOnlySlowCandidatesAndScoresALoneCandidateFully() {
        RecommendationResponse response = engine.recommend(
                new RecommendationRequest(EXAMPLE_TEAM, 3, false, null, PlayStyle.TRICK_ROOM));

        assertThat(response.candidateCount()).isEqualTo(1);
        Recommendation swampert = response.items().getFirst();
        assertThat(swampert.name()).isEqualTo("swampert");
        assertThat(swampert.score()).isEqualTo(100.0);
        assertThat(swampert.reasons()).contains("Tốc độ gốc 60 hợp Trick Room, Tấn công 110");
    }

    @Test
    void bulkyPrefersSturdyCandidates() {
        RecommendationResponse response = engine.recommend(
                new RecommendationRequest(EXAMPLE_TEAM, 3, false, null, PlayStyle.BULKY));

        assertThat(response.items()).extracting(Recommendation::name).containsExactly("garchomp", "excadrill", "swampert");
        assertThat(response.items().getFirst().reasons())
                .contains("Trâu: HP 108, Phòng thủ 95, Phòng thủ đặc biệt 85");
    }

    @Test
    void appliesLegendaryAndBaseStatTotalFilters() {
        RecommendationResponse withoutLegends = engine.recommend(
                new RecommendationRequest(EXAMPLE_TEAM, 10, true, null, null));
        RecommendationResponse strongOnly = engine.recommend(
                new RecommendationRequest(EXAMPLE_TEAM, 10, false, 550, null));

        assertThat(withoutLegends.candidateCount()).isEqualTo(11);
        assertThat(withoutLegends.items()).extracting(Recommendation::name).doesNotContain("mewtwo", "mew");
        assertThat(strongOnly.candidateCount()).isEqualTo(6);
        assertThat(strongOnly.items()).allSatisfy(item -> assertThat(item.baseStatTotal()).isGreaterThanOrEqualTo(550));
    }

    @Test
    void treatsParadoxPokemonAsLegendaryWhenExcludingLegends() {
        PokemonProfileRegistry withParadox = SynergyFixture.registry(typeChart, SynergyFixture.CATALOG_WITH_PARADOX);
        RecommendationEngine paradoxEngine = new RecommendationEngine(
                new SynergyAnalyzer(withParadox, new TeamInsightBuilder()), withParadox, new ReasonBuilder(),
                new RoleScorer());

        RecommendationResponse everyone = paradoxEngine.recommend(
                new RecommendationRequest(EXAMPLE_TEAM, 10, false, null, null));
        RecommendationResponse withoutLegends = paradoxEngine.recommend(
                new RecommendationRequest(EXAMPLE_TEAM, 10, true, null, null));

        assertThat(everyone.items().getFirst().name()).isEqualTo("iron-treads");
        assertThat(withoutLegends.candidateCount()).isEqualTo(11);
        assertThat(withoutLegends.items()).extracting(Recommendation::name)
                .doesNotContain("iron-treads", "mewtwo", "mew");
        assertThat(withoutLegends.items().getFirst().name()).isEqualTo("excadrill");
    }

    @Test
    void returnsNoItemsWhenNoCandidateMatchesAndAlwaysGivesAReason() {
        RecommendationResponse none = engine.recommend(new RecommendationRequest(EXAMPLE_TEAM, 3, false, 1530, null));
        RecommendationResponse single = engine.recommend(new RecommendationRequest(List.of(445), 10, false, null, null));

        assertThat(none.candidateCount()).isZero();
        assertThat(none.items()).isEmpty();
        assertThat(single.items()).allSatisfy(item -> assertThat(item.reasons()).isNotEmpty());
        assertThat(single.items()).extracting(Recommendation::id).doesNotContain(445);
    }

    @Test
    void rejectsAFullTeamOfSixBecauseNoSlotIsLeft() {
        assertThatThrownBy(() -> engine.recommend(new RecommendationRequest(EXAMPLE_TEAM_WITH_SIXTH, null, null, null, null)))
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.errorCode()).isEqualTo(ErrorCode.VALIDATION_FAILED));
    }

    @Test
    void appliesDefaultLimitAndLegendaryFlag() {
        RecommendationRequest request = new RecommendationRequest(EXAMPLE_TEAM, null, null, null, null);

        assertThat(request.limit()).isEqualTo(3);
        assertThat(request.excludeLegendary()).isFalse();
        assertThat(request.playStyle()).isEqualTo(PlayStyle.BALANCE);
    }

    @Test
    void isDeterministicAcrossCalls() {
        RecommendationRequest request = new RecommendationRequest(EXAMPLE_TEAM, 10, false, null, null);

        assertThat(engine.recommend(request)).isEqualTo(engine.recommend(request));
    }
}
