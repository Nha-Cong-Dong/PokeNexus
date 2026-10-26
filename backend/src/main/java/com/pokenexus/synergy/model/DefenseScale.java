package com.pokenexus.synergy.model;

public enum DefenseScale {
    IMMUNE(0.0, 3),
    QUARTER(0.25, 2),
    HALF(0.5, 1),
    NEUTRAL(1.0, 0),
    DOUBLE(2.0, -1),
    QUADRUPLE(4.0, -2);

    private final double multiplier;
    private final int score;

    DefenseScale(double multiplier, int score) {
        this.multiplier = multiplier;
        this.score = score;
    }

    public double multiplier() {
        return multiplier;
    }

    public int score() {
        return score;
    }

    public static int scoreOf(double multiplier) {
        for (DefenseScale step : values()) {
            if (multiplier <= step.multiplier) {
                return step.score;
            }
        }
        return QUADRUPLE.score;
    }
}
