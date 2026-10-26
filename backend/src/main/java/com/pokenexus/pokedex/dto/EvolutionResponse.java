package com.pokenexus.pokedex.dto;

import java.util.List;

public record EvolutionResponse(int chainId, List<EvolutionStage> stages) {
}
