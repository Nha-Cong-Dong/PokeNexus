package com.pokenexus.ingestion.loader;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.ingestion.CsvReader;

@Component
public class TypeLoader {

    public static final int EFFICACY_ROWS = PokemonType.COUNT * PokemonType.COUNT;

    private final JdbcTemplate jdbc;

    public TypeLoader(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public int load(CsvReader csv) {
        List<Object[]> types = csv.read("types.csv").stream()
                .filter(row -> isStandardType(row.integer("id")))
                .map(row -> new Object[] {row.integer("id"), row.text("identifier")})
                .toList();
        if (types.size() != PokemonType.COUNT) {
            throw new IllegalStateException(
                    "types.csv: expected %d types with id 1-18 but found %d".formatted(PokemonType.COUNT, types.size()));
        }
        jdbc.batchUpdate("INSERT INTO types (id, name) VALUES (?, ?)", types);

        List<Object[]> efficacy = csv.read("type_efficacy.csv").stream()
                .filter(row -> isStandardType(row.integer("damage_type_id")) && isStandardType(row.integer("target_type_id")))
                .map(row -> new Object[] {
                        row.integer("damage_type_id"), row.integer("target_type_id"), row.integer("damage_factor")})
                .toList();
        if (efficacy.size() != EFFICACY_ROWS) {
            throw new IllegalStateException(
                    "type_efficacy.csv: expected %d rows between types 1-18 but found %d".formatted(EFFICACY_ROWS, efficacy.size()));
        }
        jdbc.batchUpdate(
                "INSERT INTO type_efficacy (attacking_type_id, defending_type_id, damage_factor) VALUES (?, ?, ?)",
                efficacy);
        return types.size();
    }

    private static boolean isStandardType(int id) {
        return PokemonType.fromId(id).isPresent();
    }
}
