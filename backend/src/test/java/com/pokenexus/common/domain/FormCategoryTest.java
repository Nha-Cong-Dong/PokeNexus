package com.pokenexus.common.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;

import org.junit.jupiter.api.Test;

class FormCategoryTest {

    @Test
    void showsOnlyDefaultAndRegionalFormsByDefault() {
        assertThat(Arrays.stream(FormCategory.values()).filter(FormCategory::isShownByDefault))
                .containsExactly(FormCategory.DEFAULT, FormCategory.REGIONAL);
    }

    @Test
    void resolvesExactNamesOnly() {
        assertThat(FormCategory.fromName("MEGA")).contains(FormCategory.MEGA);
        assertThat(FormCategory.fromName("mega")).isEmpty();
        assertThat(FormCategory.fromName(null)).isEmpty();
    }
}
