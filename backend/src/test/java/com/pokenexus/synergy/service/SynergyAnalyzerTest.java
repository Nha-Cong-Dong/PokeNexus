package com.pokenexus.synergy.service;

import static com.pokenexus.synergy.service.SynergyFixture.CHARIZARD;
import static com.pokenexus.synergy.service.SynergyFixture.EXAMPLE_TEAM;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.pokedex.service.PokemonQueryService;
import com.pokenexus.synergy.dto.AnalyzeResponse;
import com.pokenexus.synergy.dto.AnalyzeResponse.StatRadar;
import com.pokenexus.synergy.dto.AnalyzeResponse.TypeMatrixRow;
import com.pokenexus.typechart.service.TypeChartService;

class SynergyAnalyzerTest {

    private final SynergyAnalyzer analyzer = SynergyFixture.analyzer();

    @Test
    void flagsRockAsCriticalHoleForSpecExampleOneTeam() {
        AnalyzeResponse response = analyzer.analyze(EXAMPLE_TEAM);

        TypeMatrixRow rock = rows(response).get("rock");
        assertThat(rock.multipliers()).containsExactly(4.0, 2.0, 2.0, 4.0, 4.0);
        assertThat(rock.weakCount()).isEqualTo(5);
        assertThat(rock.resistCount()).isZero();
        assertThat(rock.pressure()).isEqualTo(8);
        assertThat(rock.criticalHole()).isTrue();
    }

    @Test
    void scoresTheExampleTeamFromPressureAndCriticalHoles() {
        AnalyzeResponse response = analyzer.analyze(EXAMPLE_TEAM);
        Map<String, TypeMatrixRow> rows = rows(response);

        assertThat(response.typeMatrix()).hasSize(18);
        assertThat(rows.get("electric")).satisfies(row -> {
            assertThat(row.multipliers()).containsExactly(2.0, 4.0, 1.0, 2.0, 1.0);
            assertThat(row.pressure()).isEqualTo(4);
            assertThat(row.criticalHole()).isTrue();
        });
        assertThat(rows.get("ground")).satisfies(row -> {
            assertThat(row.resistCount()).isEqualTo(4);
            assertThat(row.weakCount()).isZero();
            assertThat(row.pressure()).isZero();
        });
        assertThat(rows.get("ice")).satisfies(row -> {
            assertThat(row.pressure()).isEqualTo(1);
            assertThat(row.criticalHole()).isFalse();
        });
        assertThat(response.teamScore()).isEqualTo(20.0);
        assertThat(response.members()).extracting(PokemonRef::name)
                .containsExactly("charizard", "gyarados", "dragonite", "talonflame", "volcarona");
    }

    @Test
    void reportsOffensiveCoverageAndAverageStats() {
        AnalyzeResponse response = analyzer.analyze(EXAMPLE_TEAM);

        assertThat(response.offensiveCoverage().coveredTypeCount()).isEqualTo(11);
        assertThat(response.offensiveCoverage().uncoveredTypes())
                .containsExactly("normal", "flying", "poison", "ghost", "water", "electric", "fairy");
        assertThat(response.statRadar()).isEqualTo(new StatRadar(85.4, 96.8, 77.6, 95.6, 91.8, 97.4));
    }

    @Test
    void scoresSingleCharizard() {
        AnalyzeResponse response = analyzer.analyze(List.of(CHARIZARD));

        assertThat(response.teamScore()).isEqualTo(76.0);
        assertThat(rows(response).get("ground").multipliers()).containsExactly(0.0);
        assertThat(rows(response).get("ground").resistCount()).isEqualTo(1);
    }

    @Test
    void rejectsSixPokemonFromSpecExampleFour() {
        assertError(() -> analyzer.analyze(List.of(6, 130, 149, 663, 637, 445)), ErrorCode.VALIDATION_FAILED);
        assertThat(ErrorCode.VALIDATION_FAILED.status().value()).isEqualTo(400);
    }

    @Test
    void rejectsEmptyNullDuplicateAndUnknownIds() {
        assertError(() -> analyzer.analyze(List.of()), ErrorCode.VALIDATION_FAILED);
        assertError(() -> analyzer.analyze(null), ErrorCode.VALIDATION_FAILED);
        assertError(() -> analyzer.analyze(Arrays.asList(6, null)), ErrorCode.VALIDATION_FAILED);
        assertError(() -> analyzer.analyze(List.of(6, 130, 6)), ErrorCode.DUPLICATE_POKEMON);
        assertError(() -> analyzer.analyze(List.of(6, 99999)), ErrorCode.UNKNOWN_POKEMON);
    }

    @Test
    void reportsDataNotReadyWhileRegistryIsEmpty() {
        TypeChartService typeChart = SynergyFixture.typeChart();
        PokemonQueryService emptyPokedex = mock(PokemonQueryService.class);
        when(emptyPokedex.findAllCatalogEntries()).thenReturn(List.of());
        PokemonProfileRegistry emptyRegistry = new PokemonProfileRegistry(emptyPokedex, typeChart);
        emptyRegistry.loadOnStartup();
        SynergyAnalyzer emptyAnalyzer = new SynergyAnalyzer(emptyRegistry, typeChart);

        assertThat(emptyRegistry.isLoaded()).isFalse();
        assertError(() -> emptyAnalyzer.analyze(List.of(CHARIZARD)), ErrorCode.DATA_NOT_READY);

        when(emptyPokedex.findAllCatalogEntries()).thenReturn(SynergyFixture.CATALOG);
        assertThat(emptyAnalyzer.analyze(List.of(CHARIZARD)).teamScore()).isEqualTo(76.0);
        assertThat(emptyRegistry.isLoaded()).isTrue();
    }

    private static Map<String, TypeMatrixRow> rows(AnalyzeResponse response) {
        return response.typeMatrix().stream()
                .collect(Collectors.toMap(TypeMatrixRow::attackingType, Function.identity()));
    }

    private static void assertError(Runnable call, ErrorCode expected) {
        assertThatThrownBy(call::run)
                .isInstanceOfSatisfying(ApiException.class, ex -> assertThat(ex.errorCode()).isEqualTo(expected));
    }
}
