package com.pokenexus.common.domain;

import java.util.Set;

public final class HiddenForms {

    public static final Set<Integer> POKEMON_IDS = Set.of(
            10093, 10116, 10118, 10119, 10121, 10122, 10128, 10129,
            10144, 10145, 10146, 10149, 10150, 10151, 10153, 10154);

    private HiddenForms() {
    }

    public static boolean isHidden(int pokemonId) {
        return POKEMON_IDS.contains(pokemonId);
    }
}
