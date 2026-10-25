package com.pokenexus.pokedex.repository;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.pokenexus.TestcontainersConfiguration;
import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.pokedex.entity.Pokemon;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Testcontainers(disabledWithoutDocker = true)
@Transactional
class PokemonRepositoryIT {

    @Autowired
    private PokemonRepository pokemonRepository;

    @Autowired
    private JdbcTemplate jdbc;

    @BeforeEach
    void seed() {
        jdbc.update("INSERT INTO types (id, name) VALUES (3, 'flying'), (10, 'fire')");
        jdbc.update("INSERT INTO regions (id, name) VALUES (1, 'kanto')");
        jdbc.update("INSERT INTO generations (id, name, region_id) VALUES (1, 'generation-i', 1)");
        jdbc.update("INSERT INTO species (id, name, generation_id) VALUES (4, 'charmander', 1), (6, 'charizard', 1)");
        jdbc.update("""
                INSERT INTO pokemon (id, species_id, name, form_category, is_default, primary_type_id, secondary_type_id,
                                     hp, attack, defense, special_attack, special_defense, speed, height_dm, weight_hg)
                VALUES (6, 6, 'charizard', 'DEFAULT', TRUE, 10, 3, 78, 84, 78, 109, 85, 100, 17, 905),
                       (4, 4, 'charmander', 'DEFAULT', TRUE, 10, NULL, 39, 52, 43, 60, 50, 65, 6, 85)
                """);
    }

    @Test
    void mapsAllColumnsOfDualTypePokemon() {
        Pokemon charizard = pokemonRepository.findById(6).orElseThrow();

        assertThat(charizard.getName()).isEqualTo("charizard");
        assertThat(charizard.getFormCategory()).isEqualTo(FormCategory.DEFAULT);
        assertThat(charizard.isDefaultForm()).isTrue();
        assertThat(charizard.getPrimaryType()).isEqualTo(PokemonType.FIRE);
        assertThat(charizard.getSecondaryType()).isEqualTo(PokemonType.FLYING);
        assertThat(charizard.getSpecialAttack()).isEqualTo(109);
        assertThat(charizard.getBaseStatTotal()).isEqualTo(534);
        assertThat(charizard.getWeightHg()).isEqualTo(905);
        assertThat(charizard.getSpecies().getGeneration().getId()).isEqualTo(1);
        assertThat(charizard.getSpecies().isLegendary()).isFalse();
        assertThat(charizard.getSpecies().isFullyEvolved()).isTrue();
    }

    @Test
    void mapsMissingSecondaryTypeToNull() {
        Pokemon charmander = pokemonRepository.findById(4).orElseThrow();

        assertThat(charmander.getSecondaryType()).isNull();
        assertThat(pokemonRepository.findById(9999)).isEmpty();
    }

    @Test
    void readsUnsignedMaximumsWithoutOverflow() {
        jdbc.update("INSERT INTO species (id, name, generation_id) VALUES (242, 'blissey', 1)");
        jdbc.update("""
                INSERT INTO pokemon (id, species_id, name, form_category, is_default, primary_type_id,
                                     hp, attack, defense, special_attack, special_defense, speed, height_dm, weight_hg)
                VALUES (242, 242, 'blissey', 'DEFAULT', TRUE, 10, 255, 10, 10, 75, 135, 55, 1000, 10000)
                """);

        Pokemon blissey = pokemonRepository.findById(242).orElseThrow();

        assertThat(blissey.getHp()).isEqualTo(255);
        assertThat(blissey.getBaseStatTotal()).isEqualTo(540);
        assertThat(blissey.getHeightDm()).isEqualTo(1000);
        assertThat(blissey.getWeightHg()).isEqualTo(10000);
    }
}
