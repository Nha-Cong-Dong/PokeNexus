package com.pokenexus.pokedex.dto;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;

class PokemonFilterTest {

    @Test
    void parsesTypesAndKeepsNumericBounds() {
        PokemonFilter filter = PokemonFilter.of(List.of("dragon", "ground"), 4, 500, 600, 100, null);

        assertThat(filter.types()).containsExactlyInAnyOrder(PokemonType.DRAGON, PokemonType.GROUND);
        assertThat(filter.generation()).isEqualTo(4);
        assertThat(filter.minBst()).isEqualTo(500);
        assertThat(filter.maxBst()).isEqualTo(600);
        assertThat(filter.minSpeed()).isEqualTo(100);
    }

    @Test
    void defaultsToDefaultAndRegionalFormsWithoutOtherFilters() {
        PokemonFilter filter = PokemonFilter.of(null, null, null, null, null, List.of());

        assertThat(filter.types()).isEmpty();
        assertThat(filter.forms()).containsExactlyInAnyOrder(FormCategory.DEFAULT, FormCategory.REGIONAL);
        assertThat(PokemonFilter.of(null, null, null, null, null, List.of("MEGA", "GMAX")).forms())
                .containsExactlyInAnyOrder(FormCategory.MEGA, FormCategory.GMAX);
    }

    @Test
    void rejectsUnknownRepeatedOrTooManyTypes() {
        assertInvalid(() -> PokemonFilter.of(List.of("stellar"), null, null, null, null, null), "unknown type 'stellar'");
        assertInvalid(() -> PokemonFilter.of(List.of("fire", "fire"), null, null, null, null, null), "repeated");
        assertInvalid(() -> PokemonFilter.of(List.of("fire", "water", "grass"), null, null, null, null, null), "at most 2");
    }

    @Test
    void rejectsOutOfRangeAndInvertedBounds() {
        assertInvalid(() -> PokemonFilter.of(null, 10, null, null, null, null), "gen must be between 1 and 9");
        assertInvalid(() -> PokemonFilter.of(null, null, null, 1531, null, null), "maxBst");
        assertInvalid(() -> PokemonFilter.of(null, null, null, null, 256, null), "minSpeed");
        assertInvalid(() -> PokemonFilter.of(null, null, 600, 500, null, null), "minBst must be <= maxBst");
        assertInvalid(() -> PokemonFilter.of(null, null, null, null, null, List.of("mega")), "unknown form 'mega'");
    }

    private static void assertInvalid(Runnable call, String message) {
        assertThatThrownBy(call::run)
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.errorCode()).isEqualTo(ErrorCode.INVALID_PARAMETER))
                .hasMessageContaining(message);
    }
}
