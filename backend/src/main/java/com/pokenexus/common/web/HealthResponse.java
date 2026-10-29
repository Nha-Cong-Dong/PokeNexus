package com.pokenexus.common.web;

public record HealthResponse(String status, boolean dataLoaded, long pokemonCount) {

    public static final String STATUS_UP = "UP";
    public static final String STATUS_DOWN = "DOWN";

    public static HealthResponse up(long pokemonCount) {
        return of(pokemonCount, pokemonCount > 0);
    }

    public static HealthResponse of(long pokemonCount, boolean dataLoaded) {
        return new HealthResponse(STATUS_UP, dataLoaded, pokemonCount);
    }

    public static HealthResponse down() {
        return new HealthResponse(STATUS_DOWN, false, 0);
    }
}
