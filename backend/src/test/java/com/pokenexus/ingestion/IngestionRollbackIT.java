package com.pokenexus.ingestion;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.pokenexus.TestcontainersConfiguration;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Testcontainers(disabledWithoutDocker = true)
class IngestionRollbackIT {

    private static final Path SAMPLE_CSV = Path.of("src/test/resources/csv");

    @Autowired
    private IngestionRunner ingestionRunner;

    @Autowired
    private JdbcTemplate jdbc;

    @TempDir
    private Path brokenCsv;

    @Test
    void rollsBackEarlierStepsWhenALaterFileIsInvalid() throws IOException {
        try (Stream<Path> files = Files.list(SAMPLE_CSV)) {
            for (Path file : files.toList()) {
                Files.copy(file, brokenCsv.resolve(file.getFileName()));
            }
        }
        Path stats = brokenCsv.resolve("pokemon_stats.csv");
        Files.writeString(stats, Files.readString(stats).replaceFirst("\n6,1,78,", "\n6,1,abc,"));

        assertThatThrownBy(() -> ingestionRunner.ingest(brokenCsv))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("pokemon_stats.csv line")
                .hasMessageContaining("column 'base_stat'");

        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM types", Integer.class)).isZero();
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM species", Integer.class)).isZero();
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM pokemon", Integer.class)).isZero();
    }
}
