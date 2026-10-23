package com.pokenexus.ingestion.loader;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.pokenexus.ingestion.CsvReader;

@Component
public class EvolutionLoader {

    private final JdbcTemplate jdbc;

    public EvolutionLoader(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public int load(CsvReader csv) {
        Map<Integer, String> triggers = new HashMap<>();
        for (CsvReader.Row row : csv.read("evolution_triggers.csv")) {
            triggers.put(row.integer("id"), row.text("identifier"));
        }

        Map<Integer, CsvReader.Row> speciesById = new HashMap<>();
        for (CsvReader.Row row : csv.read("pokemon_species.csv")) {
            speciesById.put(row.integer("id"), row);
        }

        Map<Integer, CsvReader.Row> chosenByEvolvedSpecies = new TreeMap<>();
        for (CsvReader.Row row : csv.read("pokemon_evolution.csv")) {
            if (!row.flag("is_default")) {
                continue;
            }
            chosenByEvolvedSpecies.merge(row.integer("evolved_species_id"), row,
                    (current, candidate) -> candidate.integer("id") < current.integer("id") ? candidate : current);
        }

        List<Object[]> links = chosenByEvolvedSpecies.values().stream()
                .map(row -> toLink(row, speciesById, triggers))
                .toList();
        jdbc.batchUpdate("""
                INSERT INTO evolution_links (chain_id, from_species_id, to_species_id, trigger_name, min_level, item_name)
                VALUES (?, ?, ?, ?, ?, NULL)
                """, links);
        return links.size();
    }

    private static Object[] toLink(CsvReader.Row row, Map<Integer, CsvReader.Row> speciesById, Map<Integer, String> triggers) {
        int evolvedId = row.integer("evolved_species_id");
        CsvReader.Row species = speciesById.get(evolvedId);
        if (species == null) {
            throw row.error("evolved_species_id", "species " + evolvedId + " is not in pokemon_species.csv");
        }
        Integer fromId = species.optionalInteger("evolves_from_species_id");
        if (fromId == null) {
            throw species.error("evolves_from_species_id", "species " + evolvedId + " has an evolution but no pre-evolution");
        }
        int triggerId = row.integer("evolution_trigger_id");
        String trigger = triggers.get(triggerId);
        if (trigger == null) {
            throw row.error("evolution_trigger_id", triggerId + " is not in evolution_triggers.csv");
        }
        return new Object[] {
                species.integer("evolution_chain_id"), fromId, evolvedId, trigger, row.optionalInteger("minimum_level")};
    }
}
