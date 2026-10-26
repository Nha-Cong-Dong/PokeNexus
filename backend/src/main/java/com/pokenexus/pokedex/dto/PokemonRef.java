package com.pokenexus.pokedex.dto;

import java.util.List;

public record PokemonRef(int id, String name, List<String> types) {
}
