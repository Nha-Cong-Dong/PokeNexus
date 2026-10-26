package com.pokenexus.synergy.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AnalyzeRequest(
        @NotNull @Size(min = 1, max = 5) List<@NotNull Integer> pokemonIds) {
}
