package com.pokenexus.pokedex.dto;

import java.util.List;

import com.pokenexus.common.domain.FormCategory;

public record PokemonSuggestion(int id, String name, List<String> types, FormCategory formCategory) {
}
