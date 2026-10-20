package com.pokenexus.common.domain;

import java.util.Arrays;
import java.util.Optional;

public enum PokemonType {
    NORMAL(1),
    FIGHTING(2),
    FLYING(3),
    POISON(4),
    GROUND(5),
    ROCK(6),
    BUG(7),
    GHOST(8),
    STEEL(9),
    FIRE(10),
    WATER(11),
    GRASS(12),
    ELECTRIC(13),
    PSYCHIC(14),
    ICE(15),
    DRAGON(16),
    DARK(17),
    FAIRY(18);

    public static final int COUNT = 18;

    private static final PokemonType[] BY_ID = new PokemonType[COUNT + 1];

    static {
        for (PokemonType type : values()) {
            BY_ID[type.id] = type;
        }
    }

    private final int id;

    PokemonType(int id) {
        this.id = id;
    }

    public int id() {
        return id;
    }

    public int index() {
        return id - 1;
    }

    public String identifier() {
        return name().toLowerCase();
    }

    public static Optional<PokemonType> fromId(int id) {
        if (id < 1 || id > COUNT) {
            return Optional.empty();
        }
        return Optional.of(BY_ID[id]);
    }

    public static Optional<PokemonType> fromIdentifier(String identifier) {
        if (identifier == null) {
            return Optional.empty();
        }
        return Arrays.stream(values())
                .filter(type -> type.identifier().equals(identifier))
                .findFirst();
    }
}
