package com.pokenexus.ingestion;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

class CsvReaderTest {

    @TempDir
    private Path dir;

    @Test
    void readsValuesByColumnName() throws IOException {
        Files.writeString(dir.resolve("pokemon.csv"), """
                id,identifier,species_id,height,weight,base_experience,order,is_default
                6,charizard,6,17,905,267,7,1
                10034,"charizard-mega-x",6,17,1105,,8,0
                """);

        List<CsvReader.Row> rows = new CsvReader(dir).read("pokemon.csv");

        assertThat(rows).hasSize(2);
        assertThat(rows.get(0).integer("weight")).isEqualTo(905);
        assertThat(rows.get(0).flag("is_default")).isTrue();
        assertThat(rows.get(1).text("identifier")).isEqualTo("charizard-mega-x");
        assertThat(rows.get(1).optionalInteger("base_experience")).isNull();
        assertThat(rows.get(1).line()).isEqualTo(3);
    }

    @Test
    void reportsMissingFileByName() {
        assertThatThrownBy(() -> new CsvReader(dir).read("types.csv"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("CSV file not found")
                .hasMessageContaining("types.csv");
    }

    @Test
    void reportsFileLineAndColumnOfInvalidValues() throws IOException {
        Files.writeString(dir.resolve("pokemon_stats.csv"), """
                pokemon_id,stat_id,base_stat,effort
                6,1,78,0
                6,2,abc,0
                """);
        List<CsvReader.Row> rows = new CsvReader(dir).read("pokemon_stats.csv");

        assertThatThrownBy(() -> rows.get(1).integer("base_stat"))
                .hasMessage("pokemon_stats.csv line 3, column 'base_stat': 'abc' is not an integer");
        assertThatThrownBy(() -> rows.get(0).integer("unknown"))
                .hasMessageContaining("column 'unknown': column is missing");
        assertThatThrownBy(() -> rows.get(0).flag("base_stat"))
                .hasMessageContaining("'78' is not 0 or 1");
    }
}
