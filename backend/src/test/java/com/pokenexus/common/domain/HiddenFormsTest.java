package com.pokenexus.common.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class HiddenFormsTest {

    @Test
    void hidesAbilityOnlyAndTotemDuplicates() {
        assertThat(HiddenForms.POKEMON_IDS).hasSize(16);
        assertThat(HiddenForms.isHidden(10118)).isTrue();
        assertThat(HiddenForms.isHidden(10119)).isTrue();
        assertThat(HiddenForms.isHidden(10116)).isTrue();
        assertThat(HiddenForms.isHidden(10151)).isTrue();
        assertThat(HiddenForms.isHidden(10093)).isTrue();
    }

    @Test
    void keepsDistinctForms() {
        assertThat(HiddenForms.isHidden(718)).isFalse();
        assertThat(HiddenForms.isHidden(10181)).isFalse();
        assertThat(HiddenForms.isHidden(10120)).isFalse();
        assertThat(HiddenForms.isHidden(10301)).isFalse();
        assertThat(HiddenForms.isHidden(10092)).isFalse();
    }
}
