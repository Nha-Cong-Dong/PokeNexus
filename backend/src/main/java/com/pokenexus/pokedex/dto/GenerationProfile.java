package com.pokenexus.pokedex.dto;

import java.util.List;

public record GenerationProfile(
        int generation,
        int speciesCount,
        int legendaryCount,
        int mythicalCount,
        double averageBaseStatTotal,
        List<TypeCount> topTypes,
        PokemonRef strongest,
        int strongestBaseStatTotal) {

    public GenerationProfile {
        topTypes = List.copyOf(topTypes);
    }

    public record TypeCount(String type, int count) {
    }
}
