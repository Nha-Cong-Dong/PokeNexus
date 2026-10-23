package com.pokenexus.ingestion.loader;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.pokenexus.ingestion.CsvReader;

@Component
public class GenerationLoader {

    private final JdbcTemplate jdbc;

    public GenerationLoader(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public int load(CsvReader csv) {
        List<Object[]> regions = csv.read("regions.csv").stream()
                .map(row -> new Object[] {row.integer("id"), row.text("identifier")})
                .toList();
        jdbc.batchUpdate("INSERT INTO regions (id, name) VALUES (?, ?)", regions);

        List<Object[]> generations = csv.read("generations.csv").stream()
                .map(row -> new Object[] {row.integer("id"), row.text("identifier"), row.integer("main_region_id")})
                .toList();
        jdbc.batchUpdate("INSERT INTO generations (id, name, region_id) VALUES (?, ?, ?)", generations);
        return generations.size();
    }
}
