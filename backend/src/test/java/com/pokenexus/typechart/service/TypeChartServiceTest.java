package com.pokenexus.typechart.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.typechart.dto.DefenseEntry;
import com.pokenexus.typechart.dto.TypeMatrixResponse;
import com.pokenexus.typechart.dto.TypeResponse;
import com.pokenexus.typechart.entity.TypeEfficacy;
import com.pokenexus.typechart.repository.TypeEfficacyRepository;

class TypeChartServiceTest {

    private final TypeChartService typeChart = TypeChartFixture.loadedService();

    @Test
    void computesDualTypeDefenseOfCharizardFromSpecExampleThree() {
        Map<String, Double> defense = typeChart.defenseOf(List.of(PokemonType.FIRE, PokemonType.FLYING)).stream()
                .collect(Collectors.toMap(DefenseEntry::attackingType, DefenseEntry::multiplier));

        assertThat(defense).hasSize(18)
                .containsEntry("rock", 4.0)
                .containsEntry("ground", 0.0)
                .containsEntry("water", 2.0)
                .containsEntry("electric", 2.0)
                .containsEntry("grass", 0.25)
                .containsEntry("fire", 0.5)
                .containsEntry("normal", 1.0);
    }

    @Test
    void listsDefenseEntriesInTypeIdOrder() {
        List<DefenseEntry> defense = typeChart.defenseOf(List.of(PokemonType.WATER));

        assertThat(defense).extracting(DefenseEntry::attackingType)
                .containsExactly("normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel",
                        "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy");
    }

    @Test
    void exposesSingleTypeMultipliersAsFactorOverOneHundred() {
        assertThat(typeChart.multiplier(PokemonType.FIRE, PokemonType.GRASS)).isEqualTo(2.0);
        assertThat(typeChart.multiplier(PokemonType.FIRE, PokemonType.WATER)).isEqualTo(0.5);
        assertThat(typeChart.multiplier(PokemonType.NORMAL, PokemonType.GHOST)).isEqualTo(0.0);
        assertThat(typeChart.multiplier(PokemonType.FAIRY, PokemonType.DRAGON)).isEqualTo(2.0);
    }

    @Test
    void buildsFullMatrixWithAttackingTypesAsRows() {
        TypeMatrixResponse matrix = typeChart.matrix();

        assertThat(matrix.types()).hasSize(18).startsWith("normal").endsWith("fairy");
        assertThat(matrix.multipliers()).hasSize(18).allSatisfy(row -> assertThat(row).hasSize(18));
        assertThat(matrix.multipliers().get(PokemonType.ROCK.index()).get(PokemonType.FIRE.index())).isEqualTo(2.0);
        assertThat(matrix.multipliers().get(PokemonType.FIRE.index()).get(PokemonType.ROCK.index())).isEqualTo(0.5);
    }

    @Test
    void listsEighteenTypesWithIds() {
        assertThat(typeChart.types()).hasSize(18)
                .contains(new TypeResponse(10, "fire"), new TypeResponse(18, "fairy"));
    }

    @Test
    void reportsDataNotReadyWhileTypeEfficacyTableIsIncomplete() {
        TypeEfficacyRepository repository = mock(TypeEfficacyRepository.class);
        List<TypeEfficacy> partial = TypeChartFixture.efficacyRows().subList(0, 100);
        when(repository.findAll()).thenReturn(List.of(), partial);
        TypeChartService emptyChart = new TypeChartService(repository);

        assertThat(emptyChart.reload()).isFalse();
        assertThat(emptyChart.isLoaded()).isFalse();
        assertThatThrownBy(() -> emptyChart.multiplier(PokemonType.FIRE, PokemonType.GRASS))
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.errorCode()).isEqualTo(ErrorCode.DATA_NOT_READY));
    }

    @Test
    void loadsLazilyOnceDataAppears() {
        TypeEfficacyRepository repository = mock(TypeEfficacyRepository.class);
        when(repository.findAll()).thenReturn(List.of(), TypeChartFixture.efficacyRows());
        TypeChartService lateChart = new TypeChartService(repository);
        lateChart.loadOnStartup();

        assertThat(lateChart.isLoaded()).isFalse();
        assertThat(lateChart.multiplier(PokemonType.ROCK, List.of(PokemonType.FIRE, PokemonType.FLYING))).isEqualTo(4.0);
        assertThat(lateChart.isLoaded()).isTrue();
    }
}
