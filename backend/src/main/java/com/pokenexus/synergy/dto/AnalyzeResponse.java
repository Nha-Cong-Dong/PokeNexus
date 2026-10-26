package com.pokenexus.synergy.dto;

import java.util.List;

import com.pokenexus.pokedex.dto.PokemonRef;

public record AnalyzeResponse(
        List<PokemonRef> members,
        double teamScore,
        List<TypeMatrixRow> typeMatrix,
        OffensiveCoverage offensiveCoverage,
        StatRadar statRadar) {

    public record TypeMatrixRow(
            String attackingType,
            List<Double> multipliers,
            int weakCount,
            int resistCount,
            int pressure,
            boolean criticalHole) {
    }

    public record OffensiveCoverage(int coveredTypeCount, List<String> uncoveredTypes) {
    }

    public record StatRadar(
            double hp,
            double attack,
            double defense,
            double specialAttack,
            double specialDefense,
            double speed) {
    }
}
