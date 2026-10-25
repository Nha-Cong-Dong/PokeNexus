package com.pokenexus.ingestion;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.pokenexus.TestcontainersConfiguration;
import com.pokenexus.common.web.HealthResponse;
import com.pokenexus.common.web.HealthService;

@SpringBootTest(properties = "app.ingestion.enabled=true")
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Testcontainers(disabledWithoutDocker = true)
class IngestionRunnerIT {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private IngestionRunner ingestionRunner;

    @Autowired
    private HealthService healthService;

    @Test
    void loadsOnlyTheEighteenStandardTypesAndFullEfficacyMatrix() {
        assertThat(count("types")).isEqualTo(18);
        assertThat(count("type_efficacy")).isEqualTo(324);
        assertThat(jdbc.queryForObject("SELECT name FROM types WHERE id = 10", String.class)).isEqualTo("fire");
        assertThat(jdbc.queryForObject(
                "SELECT damage_factor FROM type_efficacy WHERE attacking_type_id = 6 AND defending_type_id = 10",
                Integer.class)).isEqualTo(200);
    }

    @Test
    void groupsTypesAndSixStatsOfCharizard() {
        Map<String, Object> charizard = jdbc.queryForMap("SELECT * FROM pokemon WHERE name = 'charizard'");

        assertThat(charizard).containsEntry("primary_type_id", 10).containsEntry("secondary_type_id", 3);
        assertThat(List.of(charizard.get("hp"), charizard.get("attack"), charizard.get("defense"),
                charizard.get("special_attack"), charizard.get("special_defense"), charizard.get("speed")))
                .containsExactly(78, 84, 78, 109, 85, 100);
        assertThat(charizard).containsEntry("base_stat_total", 534).containsEntry("weight_hg", 905);
    }

    @Test
    void classifiesEveryFormCategory() {
        Map<String, Integer> byCategory = jdbc
                .queryForList("SELECT form_category, COUNT(*) AS total FROM pokemon GROUP BY form_category")
                .stream()
                .collect(Collectors.toMap(row -> (String) row.get("form_category"),
                        row -> ((Number) row.get("total")).intValue()));

        assertThat(byCategory).containsExactlyInAnyOrderEntriesOf(
                Map.of("DEFAULT", 23, "REGIONAL", 5, "MEGA", 9, "GMAX", 3, "OTHER", 22));
        assertThat(jdbc.queryForObject("SELECT form_category FROM pokemon WHERE name = 'raticate-totem-alola'",
                String.class)).isEqualTo("OTHER");
    }

    @Test
    void computesFullyEvolvedAndLegendaryFlags() {
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM species WHERE is_fully_evolved", Integer.class)).isEqualTo(12);
        assertThat(flag("is_fully_evolved", "charmander")).isFalse();
        assertThat(flag("is_fully_evolved", "charizard")).isTrue();
        assertThat(flag("is_legendary", "mewtwo")).isTrue();
        assertThat(flag("is_mythical", "mew")).isTrue();
    }

    @Test
    void keepsOneDefaultEvolutionPerSpecies() {
        assertThat(count("evolution_links")).isEqualTo(13);
        assertThat(jdbc.queryForMap("""
                SELECT from_species_id, trigger_name, min_level, item_name FROM evolution_links WHERE to_species_id = 6
                """)).containsEntry("from_species_id", 5).containsEntry("trigger_name", "level-up")
                .containsEntry("min_level", 36).containsEntry("item_name", null);
        assertThat(jdbc.queryForMap("SELECT from_species_id, trigger_name FROM evolution_links WHERE to_species_id = 26"))
                .containsEntry("from_species_id", 25).containsEntry("trigger_name", "use-item");
    }

    @Test
    void skipsSecondRunWhenPokemonAlreadyLoaded() {
        long before = count("pokemon");

        ingestionRunner.run(new DefaultApplicationArguments());

        assertThat(count("pokemon")).isEqualTo(before).isEqualTo(62);
        assertThat(count("types")).isEqualTo(18);
    }

    @Test
    void reportsDataLoadedInHealth() {
        assertThat(healthService.check()).isEqualTo(HealthResponse.up(62));
        assertThat(healthService.check().dataLoaded()).isTrue();
    }

    private long count(String table) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM " + table, Long.class);
    }

    private boolean flag(String column, String speciesName) {
        return jdbc.queryForObject("SELECT " + column + " FROM species WHERE name = ?", Boolean.class, speciesName);
    }
}
