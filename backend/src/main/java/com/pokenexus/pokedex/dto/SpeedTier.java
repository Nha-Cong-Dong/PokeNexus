package com.pokenexus.pokedex.dto;

import java.util.List;

public record SpeedTier(int speed, List<PokemonRef> pokemon) {
}
