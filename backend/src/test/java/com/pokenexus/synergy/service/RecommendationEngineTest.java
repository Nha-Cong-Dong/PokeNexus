package com.pokenexus.synergy.service;

import static com.pokenexus.synergy.service.SynergyFixture.EXAMPLE_TEAM;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.pokenexus.synergy.dto.RecommendationRequest;
import com.pokenexus.synergy.dto.RecommendationResponse;
import com.pokenexus.synergy.dto.RecommendationResponse.Recommendation;
import com.pokenexus.typechart.service.TypeChartService;

class RecommendationEngineTest {

    private static final Set<Integer> NOT_FULLY_EVOLVED_OR_SPECIAL_FORMS = Set.of(4, 10034, 10058);

    private final TypeChartService typeChart = SynergyFixture.typeChart();
    private final PokemonProfileRegistry registry = SynergyFixture.registry(typeChart);
    private final RecommendationEngine engine = new RecommendationEngine(
            new SynergyAnalyzer(registry, typeChart), registry, new ReasonBuilder());

    @Test
    void topRecommendationAddressesRockWeaknessFromSpecExampleTwo() {
        RecommendationResponse response = engine.recommend(new RecommendationRequest(EXAMPLE_TEAM, null, null, null));

        assertThat(response.items()).hasSize(3);
        Recommendation top = response.items().getFirst();
        assertThat(top.reasons()).anySatisfy(reason -> assertThat(reason).contains("Rock"));
        assertThat(top.reasons().getFirst()).isEqualTo("Chống chịu hệ Rock (đội đang hở mức 8)");
    }

    @Test
    void returnsFullyEvolvedDistinctTypeCombinationsOutsideTheTeam() {
        RecommendationResponse response = engine.recommend(new RecommendationRequest(EXAMPLE_TEAM, 10, false, null));

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
        RecommendationResponse response = engine.recommend(new RecommendationRequest(EXAMPLE_TEAM, 3, false, null));

        assertThat(response.items()).extracting(Recommendation::name)
                .containsExactly("excadrill", "swampert", "garchomp");
        Recommendation excadrill = response.items().getFirst();
        assertThat(excadrill.score()).isEqualTo(86.8);
        assertThat(excadrill.baseStatTotal()).isEqualTo(508);
        assertThat(excadrill.breakdown().defense()).isEqualTo(1.0);
        assertThat(excadrill.breakdown().offense()).isEqualTo(1.0);
        assertThat(excadrill.breakdown().stats()).isEqualTo(0.118);
        assertThat(excadrill.reasons()).containsExactly(
                "Chống chịu hệ Rock (đội đang hở mức 8)",
                "Chống chịu hệ Electric (đội đang hở mức 4)",
                "Bổ sung độ phủ tấn công lên hệ Poison, Electric, Fairy");
        assertThat(response.items()).extracting(Recommendation::score).isSortedAccordingTo((a, b) -> Double.compare(b, a));
    }

    @Test
    void appliesLegendaryAndBaseStatTotalFilters() {
        RecommendationResponse withoutLegends = engine.recommend(
                new RecommendationRequest(EXAMPLE_TEAM, 10, true, null));
        RecommendationResponse strongOnly = engine.recommend(
                new RecommendationRequest(EXAMPLE_TEAM, 10, false, 550));

        assertThat(withoutLegends.candidateCount()).isEqualTo(11);
        assertThat(withoutLegends.items()).extracting(Recommendation::name).doesNotContain("mewtwo", "mew");
        assertThat(strongOnly.candidateCount()).isEqualTo(6);
        assertThat(strongOnly.items()).allSatisfy(item -> assertThat(item.baseStatTotal()).isGreaterThanOrEqualTo(550));
    }

    @Test
    void returnsNoItemsWhenNoCandidateMatchesAndAlwaysGivesAReason() {
        RecommendationResponse none = engine.recommend(new RecommendationRequest(EXAMPLE_TEAM, 3, false, 1530));
        RecommendationResponse single = engine.recommend(new RecommendationRequest(List.of(445), 10, false, null));

        assertThat(none.candidateCount()).isZero();
        assertThat(none.items()).isEmpty();
        assertThat(single.items()).allSatisfy(item -> assertThat(item.reasons()).isNotEmpty());
        assertThat(single.items()).extracting(Recommendation::id).doesNotContain(445);
    }

    @Test
    void appliesDefaultLimitAndLegendaryFlag() {
        RecommendationRequest request = new RecommendationRequest(EXAMPLE_TEAM, null, null, null);

        assertThat(request.limit()).isEqualTo(3);
        assertThat(request.excludeLegendary()).isFalse();
    }

    @Test
    void isDeterministicAcrossCalls() {
        RecommendationRequest request = new RecommendationRequest(EXAMPLE_TEAM, 10, false, null);

        assertThat(engine.recommend(request)).isEqualTo(engine.recommend(request));
    }
}
