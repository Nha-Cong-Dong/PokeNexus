package com.pokenexus.common.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;

import org.junit.jupiter.api.Test;

class PokemonTypeTest {

    @Test
    void hasEighteenTypesWithContiguousIds() {
        assertThat(PokemonType.values()).hasSize(PokemonType.COUNT);
        assertThat(Arrays.stream(PokemonType.values()).mapToInt(PokemonType::id))
                .containsExactly(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18);
    }

    @Test
    void resolvesByPokeApiIdAndIdentifier() {
        assertThat(PokemonType.fromId(10)).contains(PokemonType.FIRE);
        assertThat(PokemonType.fromId(18)).contains(PokemonType.FAIRY);
        assertThat(PokemonType.fromIdentifier("rock")).contains(PokemonType.ROCK);
        assertThat(PokemonType.ROCK.index()).isEqualTo(5);
    }

    @Test
    void rejectsSpecialAndOutOfRangeTypes() {
        assertThat(PokemonType.fromId(0)).isEmpty();
        assertThat(PokemonType.fromId(19)).isEmpty();
        assertThat(PokemonType.fromId(10001)).isEmpty();
        assertThat(PokemonType.fromIdentifier("stellar")).isEmpty();
        assertThat(PokemonType.fromIdentifier("Fire")).isEmpty();
        assertThat(PokemonType.fromIdentifier(null)).isEmpty();
    }
}
