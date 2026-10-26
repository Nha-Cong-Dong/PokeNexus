package com.pokenexus.common.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.SQLException;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.core.JdbcTemplate;

@ExtendWith(MockitoExtension.class)
class HealthServiceTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private StaticDataCache cache;

    private HealthService healthService;

    @BeforeEach
    void setUp() {
        healthService = new HealthService(jdbcTemplate, List.of(cache));
    }

    @Test
    void reportsDataLoadedWhenPokemonTableHasRowsAndCachesAreLoaded() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class))).thenReturn(1351L);
        when(cache.isLoaded()).thenReturn(true);

        HealthResponse response = healthService.check();

        assertThat(response).isEqualTo(new HealthResponse("UP", true, 1351));
    }

    @Test
    void reloadsCacheThatWasEmptyAtStartup() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class))).thenReturn(62L);
        when(cache.isLoaded()).thenReturn(false);
        when(cache.reload()).thenReturn(true);

        assertThat(healthService.check()).isEqualTo(new HealthResponse("UP", true, 62));
        verify(cache).reload();
    }

    @Test
    void reportsDataNotLoadedWhileCacheCannotLoad() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class))).thenReturn(62L);
        when(cache.isLoaded()).thenReturn(false);
        when(cache.reload()).thenReturn(false);

        assertThat(healthService.check()).isEqualTo(new HealthResponse("UP", false, 62));
    }

    @Test
    void reportsDataNotLoadedWhenPokemonTableIsEmpty() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class))).thenReturn(0L);

        HealthResponse response = healthService.check();

        assertThat(response).isEqualTo(new HealthResponse("UP", false, 0));
        verify(cache, never()).reload();
    }

    @Test
    void staysUpWhenPokemonTableDoesNotExistYet() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class)))
                .thenThrow(new BadSqlGrammarException("count", "SELECT COUNT(*) FROM pokemon",
                        new SQLException("Table 'pokenexus.pokemon' doesn't exist")));

        HealthResponse response = healthService.check();

        assertThat(response).isEqualTo(new HealthResponse("UP", false, 0));
    }
}
