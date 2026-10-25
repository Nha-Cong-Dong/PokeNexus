package com.pokenexus.ingestion.loader;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.common.domain.StatType;
import com.pokenexus.ingestion.CsvReader;
import com.pokenexus.ingestion.FormCategoryResolver;

@Component
public class PokemonLoader {

    private static final String INSERT_POKEMON = """
            INSERT INTO pokemon (id, species_id, name, form_category, is_default, primary_type_id, secondary_type_id,
                                 hp, attack, defense, special_attack, special_defense, speed, height_dm, weight_hg)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

    private final JdbcTemplate jdbc;

    public PokemonLoader(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public int load(CsvReader csv) {
        Map<Integer, Integer[]> typesByPokemon = readTypes(csv);
        Map<Integer, Map<StatType, Integer>> statsByPokemon = readStats(csv);

        List<Object[]> pokemon = new ArrayList<>();
        for (CsvReader.Row row : csv.read("pokemon.csv")) {
            int id = row.integer("id");
            String name = row.text("identifier");
            boolean isDefault = row.flag("is_default");
            Integer[] types = typesByPokemon.get(id);
            if (types == null || types[0] == null) {
                throw row.error("id", "pokemon " + id + " has no primary type in pokemon_types.csv");
            }
            Map<StatType, Integer> stats = statsByPokemon.getOrDefault(id, Map.of());
            if (stats.size() != StatType.values().length) {
                throw row.error("id", "pokemon " + id + " has " + stats.size() + " of 6 stats in pokemon_stats.csv");
            }
            pokemon.add(new Object[] {
                    id,
                    row.integer("species_id"),
                    name,
                    FormCategoryResolver.resolve(name, isDefault).name(),
                    isDefault,
                    types[0],
                    types[1],
                    stats.get(StatType.HP),
                    stats.get(StatType.ATTACK),
                    stats.get(StatType.DEFENSE),
                    stats.get(StatType.SPECIAL_ATTACK),
                    stats.get(StatType.SPECIAL_DEFENSE),
                    stats.get(StatType.SPEED),
                    row.integer("height"),
                    row.integer("weight")});
        }
        jdbc.batchUpdate(INSERT_POKEMON, pokemon);
        return pokemon.size();
    }

    private static Map<Integer, Integer[]> readTypes(CsvReader csv) {
        Map<Integer, Integer[]> typesByPokemon = new HashMap<>();
        for (CsvReader.Row row : csv.read("pokemon_types.csv")) {
            int typeId = row.integer("type_id");
            if (PokemonType.fromId(typeId).isEmpty()) {
                throw row.error("type_id", typeId + " is not one of the 18 standard types");
            }
            int slot = row.integer("slot");
            if (slot != 1 && slot != 2) {
                throw row.error("slot", slot + " is not 1 or 2");
            }
            typesByPokemon.computeIfAbsent(row.integer("pokemon_id"), key -> new Integer[2])[slot - 1] = typeId;
        }
        return typesByPokemon;
    }

    private static Map<Integer, Map<StatType, Integer>> readStats(CsvReader csv) {
        Map<Integer, Map<StatType, Integer>> statsByPokemon = new HashMap<>();
        for (CsvReader.Row row : csv.read("pokemon_stats.csv")) {
            int statId = row.integer("stat_id");
            StatType stat = StatType.fromCsvId(statId)
                    .orElseThrow(() -> row.error("stat_id", statId + " is not a base stat (1-6)"));
            statsByPokemon.computeIfAbsent(row.integer("pokemon_id"), key -> new EnumMap<>(StatType.class))
                    .put(stat, row.integer("base_stat"));
        }
        return statsByPokemon;
    }
}
