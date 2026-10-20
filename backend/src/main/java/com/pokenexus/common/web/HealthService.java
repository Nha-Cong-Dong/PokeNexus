package com.pokenexus.common.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class HealthService {

    private static final Logger log = LoggerFactory.getLogger(HealthService.class);
    private static final String COUNT_POKEMON_SQL = "SELECT COUNT(*) FROM pokemon";

    private final JdbcTemplate jdbcTemplate;

    public HealthService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public HealthResponse check() {
        return HealthResponse.up(countPokemon());
    }

    private long countPokemon() {
        try {
            Long count = jdbcTemplate.queryForObject(COUNT_POKEMON_SQL, Long.class);
            return count != null ? count : 0;
        } catch (DataAccessException ex) {
            log.debug("Pokemon table not readable yet: {}", ex.getMessage());
            return 0;
        }
    }
}
