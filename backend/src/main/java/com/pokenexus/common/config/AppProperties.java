package com.pokenexus.common.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
        @DefaultValue Ingestion ingestion,
        @DefaultValue Cors cors,
        @DefaultValue Team team) {

    public record Ingestion(
            @DefaultValue("false") boolean enabled,
            @DefaultValue("../data/csv") String csvDir) {
    }

    public record Cors(
            @DefaultValue("http://localhost:5173") List<String> allowedOrigins) {
    }

    public record Team(
            @DefaultValue("10") int saveLimitPerMinute) {
    }
}
