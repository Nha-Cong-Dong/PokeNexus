package com.pokenexus.common.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class StatTypeTest {

    @Test
    void resolvesSixBaseStatsByCsvId() {
        assertThat(StatType.fromCsvId(1)).contains(StatType.HP);
        assertThat(StatType.fromCsvId(4)).contains(StatType.SPECIAL_ATTACK);
        assertThat(StatType.fromCsvId(6)).contains(StatType.SPEED);
        assertThat(StatType.SPECIAL_DEFENSE.identifier()).isEqualTo("special-defense");
    }

    @Test
    void ignoresNonBaseStats() {
        assertThat(StatType.fromCsvId(7)).isEmpty();
        assertThat(StatType.fromCsvId(9)).isEmpty();
        assertThat(StatType.fromCsvId(0)).isEmpty();
    }
}
