package com.pokenexus.common.domain;

import java.util.Arrays;
import java.util.Optional;

public enum StatType {
    HP(1, "hp"),
    ATTACK(2, "attack"),
    DEFENSE(3, "defense"),
    SPECIAL_ATTACK(4, "special-attack"),
    SPECIAL_DEFENSE(5, "special-defense"),
    SPEED(6, "speed");

    private final int csvId;
    private final String identifier;

    StatType(int csvId, String identifier) {
        this.csvId = csvId;
        this.identifier = identifier;
    }

    public int csvId() {
        return csvId;
    }

    public String identifier() {
        return identifier;
    }

    public static Optional<StatType> fromCsvId(int csvId) {
        return Arrays.stream(values())
                .filter(stat -> stat.csvId == csvId)
                .findFirst();
    }
}
