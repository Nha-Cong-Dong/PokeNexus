package com.pokenexus.pokedex.dto;

import java.util.List;

public record CompareResponse(PokemonDetail left, PokemonDetail right, Verdict verdict) {

    public enum Winner {
        LEFT,
        RIGHT,
        TIE;

        public static Winner of(double left, double right) {
            int comparison = Double.compare(left, right);
            if (comparison > 0) {
                return LEFT;
            }
            return comparison < 0 ? RIGHT : TIE;
        }
    }

    public record Verdict(
            TypeAdvantage typeAdvantage,
            StatComparison statTotal,
            StatComparison speed,
            List<String> summary) {
    }

    public record TypeAdvantage(double leftBestMultiplier, double rightBestMultiplier, Winner winner) {
    }

    public record StatComparison(int difference, Winner winner) {
    }
}
