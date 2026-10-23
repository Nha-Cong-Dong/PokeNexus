package com.pokenexus;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Testcontainers(disabledWithoutDocker = true)
@Transactional
class SchemaMigrationIT {

    private static final String INSERT_POKEMON = """
            INSERT INTO pokemon (id, species_id, name, form_category, is_default, primary_type_id, secondary_type_id,
                                 hp, attack, defense, special_attack, special_defense, speed, height_dm, weight_hg)
            VALUES (?, 6, ?, ?, TRUE, ?, ?, 78, 84, 78, 109, 85, 100, 17, 905)
            """;

    @Autowired
    private JdbcTemplate jdbc;

    @BeforeEach
    void seedCharizard() {
        jdbc.update("INSERT INTO types (id, name) VALUES (3, 'flying'), (6, 'rock'), (10, 'fire')");
        jdbc.update("INSERT INTO regions (id, name) VALUES (1, 'kanto')");
        jdbc.update("INSERT INTO generations (id, name, region_id) VALUES (1, 'generation-i', 1)");
        jdbc.update("INSERT INTO evolution_chains (id) VALUES (2)");
        jdbc.update("INSERT INTO species (id, name, generation_id, evolution_chain_id) VALUES (6, 'charizard', 1, 2)");
        jdbc.update(INSERT_POKEMON, 6, "charizard", "DEFAULT", 10, 3);
    }

    @Test
    void appliesThreeVersionedMigrationsSuccessfully() {
        List<String> versions = jdbc.queryForList(
                "SELECT version FROM flyway_schema_history WHERE success = 1 AND version IS NOT NULL ORDER BY installed_rank",
                String.class);

        assertThat(versions).containsExactly("1", "2", "3");
    }

    @Test
    void createsAllMvpTables() {
        List<String> tables = jdbc.queryForList("""
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = DATABASE() AND table_name <> 'flyway_schema_history'
                """, String.class);

        assertThat(tables).containsExactlyInAnyOrder("types", "type_efficacy", "regions", "generations",
                "evolution_chains", "species", "pokemon", "evolution_links", "teams", "team_members");
    }

    @Test
    void computesBaseStatTotalAsStoredColumn() {
        Integer total = jdbc.queryForObject("SELECT base_stat_total FROM pokemon WHERE id = 6", Integer.class);

        assertThat(total).isEqualTo(534);
    }

    @Test
    void acceptsKnownDamageFactorAndRejectsOthers() {
        jdbc.update("INSERT INTO type_efficacy VALUES (6, 3, 200)");

        assertThatThrownBy(() -> jdbc.update("INSERT INTO type_efficacy VALUES (6, 10, 75)"))
                .isInstanceOf(DataAccessException.class)
                .hasMessageContaining("ck_type_efficacy_damage_factor");
    }

    @Test
    void rejectsSecondaryTypeEqualToPrimaryType() {
        assertThatThrownBy(() -> jdbc.update(INSERT_POKEMON, 10034, "charizard-mega-x", "MEGA", 10, 10))
                .isInstanceOf(DataAccessException.class)
                .hasMessageContaining("ck_pokemon_distinct_types");
    }

    @Test
    void rejectsUnknownFormCategory() {
        assertThatThrownBy(() -> jdbc.update(INSERT_POKEMON, 10035, "charizard-mega-y", "FOO", 10, 3))
                .isInstanceOf(DataAccessException.class)
                .hasMessageContaining("ck_pokemon_form_category");
    }

    @Test
    void rejectsSlotOutsideOneToSix() {
        long teamId = insertTeam("a1B2c3D4");

        assertThatThrownBy(() -> jdbc.update("INSERT INTO team_members (team_id, slot, pokemon_id) VALUES (?, 7, 6)", teamId))
                .isInstanceOf(DataAccessException.class)
                .hasMessageContaining("ck_team_members_slot");
    }

    @Test
    void rejectsSamePokemonTwiceInOneTeam() {
        long teamId = insertTeam("a1B2c3D4");
        jdbc.update("INSERT INTO team_members (team_id, slot, pokemon_id) VALUES (?, 1, 6)", teamId);

        assertThatThrownBy(() -> jdbc.update("INSERT INTO team_members (team_id, slot, pokemon_id) VALUES (?, 2, 6)", teamId))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void treatsShareCodesDifferingOnlyByCaseAsDistinct() {
        insertTeam("abcDEF12");
        insertTeam("ABCdef12");

        assertThatThrownBy(() -> insertTeam("abcDEF12")).isInstanceOf(DataIntegrityViolationException.class);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM teams", Integer.class)).isEqualTo(2);
    }

    @Test
    void deletesMembersWhenTeamIsDeleted() {
        long teamId = insertTeam("a1B2c3D4");
        jdbc.update("INSERT INTO team_members (team_id, slot, pokemon_id) VALUES (?, 1, 6)", teamId);

        jdbc.update("DELETE FROM teams WHERE id = ?", teamId);

        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM team_members", Integer.class)).isZero();
    }

    private long insertTeam(String shareCode) {
        jdbc.update("INSERT INTO teams (name, share_code) VALUES ('Rain Team', ?)", shareCode);
        return jdbc.queryForObject("SELECT id FROM teams WHERE share_code = ?", Long.class, shareCode);
    }
}
