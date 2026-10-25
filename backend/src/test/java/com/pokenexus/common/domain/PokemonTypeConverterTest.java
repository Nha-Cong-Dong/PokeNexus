package com.pokenexus.common.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class PokemonTypeConverterTest {

    private final PokemonTypeConverter converter = new PokemonTypeConverter();

    @Test
    void convertsBetweenTypeAndPokeApiId() {
        assertThat(converter.convertToDatabaseColumn(PokemonType.FIRE)).isEqualTo(10);
        assertThat(converter.convertToEntityAttribute(18)).isEqualTo(PokemonType.FAIRY);
    }

    @Test
    void keepsNullForMissingSecondaryType() {
        assertThat(converter.convertToDatabaseColumn(null)).isNull();
        assertThat(converter.convertToEntityAttribute(null)).isNull();
    }

    @Test
    void rejectsIdOutsideEighteenTypes() {
        assertThatThrownBy(() -> converter.convertToEntityAttribute(19))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("19");
    }
}
