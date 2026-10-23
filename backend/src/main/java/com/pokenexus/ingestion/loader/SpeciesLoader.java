package com.pokenexus.ingestion.loader;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.pokenexus.ingestion.CsvReader;

@Component
public class SpeciesLoader {

    private final JdbcTemplate jdbc;

    public SpeciesLoader(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public int load(CsvReader csv) {
        List<Object[]> chains = csv.read("evolution_chains.csv").stream()
                .map(row -> new Object[] {row.integer("id")})
                .toList();
        jdbc.batchUpdate("INSERT INTO evolution_chains (id) VALUES (?)", chains);

        List<CsvReader.Row> rows = csv.read("pokemon_species.csv");
        Set<Integer> preEvolutionIds = rows.stream()
                .map(row -> row.optionalInteger("evolves_from_species_id"))
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        List<Object[]> species = rows.stream()
                .map(row -> new Object[] {
                        row.integer("id"),
                        row.text("identifier"),
                        row.integer("generation_id"),
                        row.optionalInteger("evolution_chain_id"),
                        row.flag("is_legendary"),
                        row.flag("is_mythical"),
                        !preEvolutionIds.contains(row.integer("id"))})
                .toList();
        jdbc.batchUpdate("""
                INSERT INTO species (id, name, generation_id, evolution_chain_id, is_legendary, is_mythical, is_fully_evolved)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """, species);
        return species.size();
    }
}
