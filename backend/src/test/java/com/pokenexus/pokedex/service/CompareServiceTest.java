package com.pokenexus.pokedex.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.pokedex.dto.CompareResponse;
import com.pokenexus.pokedex.dto.CompareResponse.Verdict;
import com.pokenexus.pokedex.dto.CompareResponse.Winner;
import com.pokenexus.pokedex.dto.PokemonDetail;
import com.pokenexus.pokedex.dto.Stats;
import com.pokenexus.typechart.service.TypeChartFixture;

class CompareServiceTest {

    private static final PokemonDetail GARCHOMP = detail(445, "garchomp", List.of("dragon", "ground"),
            new Stats(108, 130, 95, 80, 85, 102));
    private static final PokemonDetail SALAMENCE = detail(373, "salamence", List.of("dragon", "flying"),
            new Stats(95, 135, 80, 110, 80, 100));
    private static final PokemonDetail CHARIZARD = detail(6, "charizard", List.of("fire", "flying"),
            new Stats(78, 84, 78, 109, 85, 100));
    private static final PokemonDetail VAPOREON = detail(134, "vaporeon", List.of("water"),
            new Stats(130, 65, 60, 110, 95, 65));

    private final PokemonQueryService pokemonQueryService = mock(PokemonQueryService.class);
    private final CompareService compareService =
            new CompareService(pokemonQueryService, TypeChartFixture.loadedService());

    @Test
    void concludesGarchompIsFasterThanSalamence() {
        Verdict verdict = compareService.verdict(GARCHOMP, SALAMENCE);

        assertThat(verdict.speed()).isEqualTo(new CompareResponse.StatComparison(2, Winner.LEFT));
        assertThat(verdict.statTotal()).isEqualTo(new CompareResponse.StatComparison(0, Winner.TIE));
        assertThat(verdict.typeAdvantage())
                .isEqualTo(new CompareResponse.TypeAdvantage(2.0, 2.0, Winner.TIE));
        assertThat(verdict.summary()).containsExactly(
                "Hai bên cân bằng về hệ (đòn cùng hệ tốt nhất đều x2).",
                "Hai bên có tổng chỉ số bằng nhau (600).",
                "Garchomp nhanh hơn (102 so với 100).");
    }

    @Test
    void awardsTypeAdvantageToTheSideWithTheBetterStabMultiplier() {
        Verdict verdict = compareService.verdict(CHARIZARD, VAPOREON);

        assertThat(verdict.typeAdvantage())
                .isEqualTo(new CompareResponse.TypeAdvantage(1.0, 2.0, Winner.RIGHT));
        assertThat(verdict.statTotal()).isEqualTo(new CompareResponse.StatComparison(9, Winner.LEFT));
        assertThat(verdict.summary()).containsExactly(
                "Vaporeon có lợi thế hệ (đòn cùng hệ tốt nhất x2 so với x1).",
                "Charizard có tổng chỉ số cao hơn (534 so với 525).",
                "Charizard nhanh hơn (100 so với 65).");
    }

    @Test
    void rejectsTheSamePokemonOnBothSides() {
        assertThatThrownBy(() -> compareService.compare("garchomp", "garchomp"))
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.errorCode()).isEqualTo(ErrorCode.INVALID_PARAMETER));
        verify(pokemonQueryService, never()).findDetail(anyString());

        when(pokemonQueryService.findDetail("445")).thenReturn(GARCHOMP);
        when(pokemonQueryService.findDetail("garchomp")).thenReturn(GARCHOMP);
        assertThatThrownBy(() -> compareService.compare("445", "garchomp"))
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.errorCode()).isEqualTo(ErrorCode.INVALID_PARAMETER));
    }

    @Test
    void formatsNamesAndMultipliersForSummary() {
        assertThat(CompareService.displayName(detail(10009, "rotom-wash", List.of("electric", "water"),
                new Stats(50, 65, 107, 105, 107, 86)))).isEqualTo("Rotom-Wash");
        assertThat(CompareService.formatMultiplier(0.25)).isEqualTo("0.25");
        assertThat(CompareService.formatMultiplier(0.0)).isEqualTo("0");
        assertThat(CompareService.formatMultiplier(4.0)).isEqualTo("4");
    }

    private static PokemonDetail detail(int id, String name, List<String> types, Stats stats) {
        int total = stats.hp() + stats.attack() + stats.defense() + stats.specialAttack()
                + stats.specialDefense() + stats.speed();
        return new PokemonDetail(id, name, types, id, name, 1, FormCategory.DEFAULT, false, false, true,
                stats, total, 10, 100, List.of(), List.of());
    }
}
