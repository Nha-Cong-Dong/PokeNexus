package com.pokenexus.typechart.dto;

import com.pokenexus.common.domain.PokemonType;

public record TypeResponse(int id, String name) {

    public static TypeResponse from(PokemonType type) {
        return new TypeResponse(type.id(), type.identifier());
    }
}
