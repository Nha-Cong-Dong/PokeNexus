package com.pokenexus.pokedex.dto;

import java.util.List;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.typechart.dto.DefenseEntry;

public record PokemonDetail(
        int id,
        String name,
        List<String> types,
        int speciesId,
        String speciesName,
        int generation,
        FormCategory formCategory,
        boolean isLegendary,
        boolean isMythical,
        boolean isFullyEvolved,
        Stats stats,
        int baseStatTotal,
        int heightDm,
        int weightHg,
        List<DefenseEntry> defense,
        List<Form> forms) {

    public record Form(int id, String name, FormCategory formCategory) {
    }
}
