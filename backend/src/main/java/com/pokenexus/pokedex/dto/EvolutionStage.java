package com.pokenexus.pokedex.dto;

import java.util.List;

public record EvolutionStage(
        int speciesId,
        int pokemonId,
        String name,
        List<String> types,
        Integer evolvesFromSpeciesId,
        String trigger,
        Integer minLevel,
        String item) {
}
