package com.pokenexus.common.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.sql.SQLException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.core.JdbcTemplate;

@ExtendWith(MockitoExtension.class)
class HealthServiceTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private HealthService healthService;

    @Test
    void reportsDataLoadedWhenPokemonTableHasRows() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class))).thenReturn(1351L);

        HealthResponse response = healthService.check();

        assertThat(response).isEqualTo(new HealthResponse("UP", true, 1351));
    }

    @Test
    void reportsDataNotLoadedWhenPokemonTableIsEmpty() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class))).thenReturn(0L);

        HealthResponse response = healthService.check();

        assertThat(response).isEqualTo(new HealthResponse("UP", false, 0));
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
