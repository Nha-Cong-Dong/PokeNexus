package com.pokenexus.pokedex.dto;

import java.util.List;

import com.pokenexus.common.domain.FormCategory;

public record PokemonSummary(
        int id,
        String name,
        List<String> types,
        int generation,
        FormCategory formCategory,
        int baseStatTotal,
        int speed) {
}
