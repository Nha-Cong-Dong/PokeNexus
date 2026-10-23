package com.pokenexus.pokedex.mapper;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import org.springframework.stereotype.Component;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.pokedex.dto.PokemonSummary;
import com.pokenexus.pokedex.entity.Pokemon;

@Component
public class PokemonMapper {

    public PokemonSummary toSummary(Pokemon pokemon) {
        return new PokemonSummary(
                pokemon.getId(),
                pokemon.getName(),
                typeNames(pokemon),
                pokemon.getSpecies().getGeneration().getId(),
                pokemon.getFormCategory(),
                pokemon.getBaseStatTotal(),
                pokemon.getSpeed());
    }

    private static List<String> typeNames(Pokemon pokemon) {
        return Stream.of(pokemon.getPrimaryType(), pokemon.getSecondaryType())
                .filter(Objects::nonNull)
                .map(PokemonType::identifier)
                .toList();
    }
}
