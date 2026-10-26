package com.pokenexus.pokedex.dto;

import java.util.List;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.common.domain.PokemonType;

public record PokemonCatalogEntry(
        int id,
        String name,
        List<PokemonType> types,
        FormCategory formCategory,
        boolean legendary,
        boolean mythical,
        boolean fullyEvolved,
        Stats stats,
        int baseStatTotal) {
}
