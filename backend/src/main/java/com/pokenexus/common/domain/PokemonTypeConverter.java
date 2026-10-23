package com.pokenexus.common.domain;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class PokemonTypeConverter implements AttributeConverter<PokemonType, Integer> {

    @Override
    public Integer convertToDatabaseColumn(PokemonType type) {
        return type == null ? null : type.id();
    }

    @Override
    public PokemonType convertToEntityAttribute(Integer id) {
        if (id == null) {
            return null;
        }
        return PokemonType.fromId(id)
                .orElseThrow(() -> new IllegalArgumentException("Unknown type id: " + id));
    }
}
