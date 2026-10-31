package com.pokenexus.synergy.dto;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.pokenexus.synergy.model.PlayStyle;

public record RecommendationRequest(
        @NotNull @Size(min = 1, max = 5) List<@NotNull Integer> pokemonIds,
        @Min(1) @Max(10) Integer limit,
        Boolean excludeLegendary,
        @Min(0) @Max(1530) Integer minBaseStatTotal,
        PlayStyle playStyle) {

    public static final int DEFAULT_LIMIT = 3;
    public static final PlayStyle DEFAULT_PLAY_STYLE = PlayStyle.BALANCE;

    public RecommendationRequest {
        limit = limit == null ? DEFAULT_LIMIT : limit;
        excludeLegendary = excludeLegendary != null && excludeLegendary;
        playStyle = playStyle == null ? DEFAULT_PLAY_STYLE : playStyle;
    }
}
