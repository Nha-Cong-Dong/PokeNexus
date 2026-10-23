package com.pokenexus.ingestion;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import com.pokenexus.common.domain.FormCategory;

class FormCategoryResolverTest {

    @ParameterizedTest
    @CsvSource({
            "charizard, true, DEFAULT",
            "meowstic-male, true, DEFAULT",
            "vulpix-alola, false, REGIONAL",
            "zigzagoon-galar, false, REGIONAL",
            "charizard-mega-x, false, MEGA",
            "charizard-gmax, false, GMAX",
            "rotom-wash, false, OTHER",
            "kyogre-primal, false, OTHER"
    })
    void classifiesFormsByNameAndDefaultFlag(String name, boolean isDefault, FormCategory expected) {
        assertThat(FormCategoryResolver.resolve(name, isDefault)).isEqualTo(expected);
    }

    @ParameterizedTest
    @CsvSource({
            "raticate-totem-alola, OTHER",
            "pikachu-alola-cap, OTHER",
            "pikachu-world-cap, OTHER"
    })
    void checksTotemAndCapBeforeRegionalMarkers(String name, FormCategory expected) {
        assertThat(FormCategoryResolver.resolve(name, false)).isEqualTo(expected);
    }
}
