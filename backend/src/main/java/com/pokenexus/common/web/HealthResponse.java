package com.pokenexus.common.web;

public record HealthResponse(String status, boolean dataLoaded, long pokemonCount) {

    public static final String STATUS_UP = "UP";

    public static HealthResponse up(long pokemonCount) {
        return new HealthResponse(STATUS_UP, pokemonCount > 0, pokemonCount);
    }
}
