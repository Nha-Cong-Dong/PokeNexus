package com.pokenexus.common.web;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class HealthService {

    private static final Logger log = LoggerFactory.getLogger(HealthService.class);
    private static final String COUNT_POKEMON_SQL = "SELECT COUNT(*) FROM pokemon";

    private final JdbcTemplate jdbcTemplate;
    private final List<StaticDataCache> caches;

    public HealthService(JdbcTemplate jdbcTemplate, List<StaticDataCache> caches) {
        this.jdbcTemplate = jdbcTemplate;
        this.caches = List.copyOf(caches);
    }

    public HealthResponse check() {
        long pokemonCount;
        try {
            pokemonCount = countPokemon();
        } catch (DataAccessException ex) {
            log.warn("Database is unreachable: {}", ex.getMessage());
            return HealthResponse.down();
        }
        return HealthResponse.of(pokemonCount, pokemonCount > 0 && cachesLoaded());
    }

    private boolean cachesLoaded() {
        for (StaticDataCache cache : caches) {
            if (!isLoaded(cache)) {
                return false;
            }
        }
        return true;
    }

    private static boolean isLoaded(StaticDataCache cache) {
        try {
            return cache.isLoaded() || cache.reload();
        } catch (RuntimeException ex) {
            log.warn("In-memory cache {} could not be loaded: {}", cache.getClass().getSimpleName(), ex.getMessage());
            return false;
        }
    }

    private long countPokemon() {
        try {
            Long count = jdbcTemplate.queryForObject(COUNT_POKEMON_SQL, Long.class);
            return count != null ? count : 0;
        } catch (BadSqlGrammarException ex) {
            log.debug("Pokemon table not readable yet: {}", ex.getMessage());
            return 0;
        }
    }
}
