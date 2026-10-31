package com.pokenexus.pokedex.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.pokenexus.TestcontainersConfiguration;

@SpringBootTest(properties = "app.ingestion.enabled=true")
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Testcontainers(disabledWithoutDocker = true)
class PokemonControllerIT {

    @Autowired
    private MockMvcTester mvc;

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void showsCharizardDetailWithDefenseGridAndAllForms() {
        assertThat(mvc.get().uri("/api/v1/pokemon/charizard"))
                .hasStatusOk()
                .hasHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                .bodyJson()
                .satisfies(json -> {
                    assertThat(json).isLenientlyEqualTo("""
                            {
                              "id": 6, "name": "charizard", "types": ["fire", "flying"],
                              "speciesId": 6, "speciesName": "charizard", "generation": 1, "formCategory": "DEFAULT",
                              "isLegendary": false, "isMythical": false, "isFullyEvolved": true,
                              "stats": { "hp": 78, "attack": 84, "defense": 78, "specialAttack": 109,
                                         "specialDefense": 85, "speed": 100 },
                              "baseStatTotal": 534, "heightDm": 17, "weightHg": 905,
                              "forms": [
                                { "id": 6, "name": "charizard", "formCategory": "DEFAULT" },
                                { "id": 10034, "name": "charizard-mega-x", "formCategory": "MEGA" },
                                { "id": 10035, "name": "charizard-mega-y", "formCategory": "MEGA" },
                                { "id": 10196, "name": "charizard-gmax", "formCategory": "GMAX" }
                              ]
                            }
                            """);
                    assertThat(json).extractingPath("$.defense.length()").isEqualTo(18);
                    assertThat(json).extractingPath("$.defense[5]").isEqualTo(
                            Map.of("attackingType", "rock", "multiplier", 4.0));
                    assertThat(json).extractingPath("$.defense[4].multiplier").isEqualTo(0.0);
                    assertThat(json).extractingPath("$.defense[10].multiplier").isEqualTo(2.0);
                    assertThat(json).extractingPath("$.defense[12].multiplier").isEqualTo(2.0);
                });
    }

    @Test
    void findsDetailByNumericIdAndFlagsLegendary() {
        assertThat(mvc.get().uri("/api/v1/pokemon/150"))
                .hasStatusOk()
                .bodyJson()
                .isLenientlyEqualTo("""
                        { "id": 150, "name": "mewtwo", "isLegendary": true, "isMythical": false }
                        """);
    }

    @Test
    void returnsNotFoundForUnknownPokemonAndBadRequestForMalformedName() {
        assertThat(mvc.get().uri("/api/v1/pokemon/abc-xyz"))
                .hasStatus(404)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("POKEMON_NOT_FOUND");
        assertThat(mvc.get().uri("/api/v1/pokemon/99999"))
                .hasStatus(404)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("POKEMON_NOT_FOUND");
        assertThat(mvc.get().uri("/api/v1/pokemon/Char_izard"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("INVALID_PARAMETER");
    }

    @Test
    void suggestsPrefixMatchesBeforeContainsMatches() {
        assertThat(mvc.get().uri("/api/v1/pokemon/search?q=ch"))
                .hasStatusOk()
                .bodyJson()
                .extractingPath("$[*].name").asArray()
                .containsExactly("charmander", "charmeleon", "charizard", "pikachu", "raichu", "pichu", "garchomp",
                        "raichu-alola");
        assertThat(mvc.get().uri("/api/v1/pokemon/search").param("q", " CHAR ").param("limit", "2"))
                .hasStatusOk()
                .bodyJson()
                .isStrictlyEqualTo("""
                        [
                          { "id": 4, "name": "charmander", "types": ["fire"] },
                          { "id": 5, "name": "charmeleon", "types": ["fire"] }
                        ]
                        """);
    }

    @Test
    @Transactional
    void ordersPrefixGroupFirstEvenWhenContainsMatchHasSmallerId() {
        jdbc.update("""
                INSERT INTO pokemon (id, species_id, name, form_category, is_default, primary_type_id,
                                     hp, attack, defense, special_attack, special_defense, speed, height_dm, weight_hg)
                VALUES (1, 4, 'xchar', 'DEFAULT', FALSE, 10, 1, 1, 1, 1, 1, 1, 1, 1)
                """);

        assertThat(mvc.get().uri("/api/v1/pokemon/search?q=char"))
                .hasStatusOk()
                .bodyJson()
                .extractingPath("$[*].name").asArray()
                .containsExactly("charmander", "charmeleon", "charizard", "xchar");
    }

    @Test
    void filtersSuggestionsByFormAndReturnsEmptyArrayWithoutMatch() {
        assertThat(mvc.get().uri("/api/v1/pokemon/search?q=charizard&form=MEGA&form=GMAX"))
                .hasStatusOk()
                .bodyJson()
                .extractingPath("$[*].name").asArray()
                .containsExactly("charizard-mega-x", "charizard-mega-y", "charizard-gmax");
        assertThat(mvc.get().uri("/api/v1/pokemon/search?q=zzz"))
                .hasStatusOk()
                .bodyJson()
                .isStrictlyEqualTo("[]");
    }

    @Test
    void rejectsInvalidSearchParameters() {
        for (String uri : new String[] {"/api/v1/pokemon/search?q=c", "/api/v1/pokemon/search",
                "/api/v1/pokemon/search?q=char&limit=11", "/api/v1/pokemon/search?q=" + "a".repeat(31),
                "/api/v1/pokemon/search?q=char&form=mega"}) {
            assertThat(mvc.get().uri(uri))
                    .hasStatus(400)
                    .bodyJson()
                    .extractingPath("$.code").isEqualTo("INVALID_PARAMETER");
        }
    }

    @Test
    void comparesGarchompWithSalamence() {
        assertThat(mvc.get().uri("/api/v1/pokemon/compare?left=garchomp&right=373"))
                .hasStatusOk()
                .bodyJson()
                .isLenientlyEqualTo("""
                        {
                          "left": { "id": 445, "name": "garchomp" },
                          "right": { "id": 373, "name": "salamence" },
                          "verdict": {
                            "typeAdvantage": { "leftBestMultiplier": 2.0, "rightBestMultiplier": 2.0, "winner": "TIE" },
                            "statTotal": { "difference": 0, "winner": "TIE" },
                            "speed": { "difference": 2, "winner": "LEFT" },
                            "summary": [
                              "Hai bên cân bằng về hệ (đòn cùng hệ tốt nhất đều x2).",
                              "Hai bên có tổng chỉ số bằng nhau (600).",
                              "Garchomp nhanh hơn (102 so với 100)."
                            ]
                          }
                        }
                        """);
    }

    @Test
    void rejectsInvalidComparePairs() {
        assertThat(mvc.get().uri("/api/v1/pokemon/compare?left=garchomp&right=garchomp"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("INVALID_PARAMETER");
        assertThat(mvc.get().uri("/api/v1/pokemon/compare?left=garchomp"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("INVALID_PARAMETER");
        assertThat(mvc.get().uri("/api/v1/pokemon/compare?left=garchomp&right=missingno"))
                .hasStatus(404)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("POKEMON_NOT_FOUND");
    }

    @Test
    void listsCharizardEvolutionChainFromAnyForm() {
        String expected = """
                {
                  "chainId": 2,
                  "stages": [
                    { "speciesId": 4, "pokemonId": 4, "name": "charmander", "types": ["fire"],
                      "evolvesFromSpeciesId": null, "trigger": null, "minLevel": null, "item": null },
                    { "speciesId": 5, "pokemonId": 5, "name": "charmeleon", "types": ["fire"],
                      "evolvesFromSpeciesId": 4, "trigger": "level-up", "minLevel": 16, "item": null },
                    { "speciesId": 6, "pokemonId": 6, "name": "charizard", "types": ["fire", "flying"],
                      "evolvesFromSpeciesId": 5, "trigger": "level-up", "minLevel": 36, "item": null }
                  ]
                }
                """;
        assertThat(mvc.get().uri("/api/v1/pokemon/charizard/evolution"))
                .hasStatusOk().bodyJson().isStrictlyEqualTo(expected);
        assertThat(mvc.get().uri("/api/v1/pokemon/10034/evolution"))
                .hasStatusOk().bodyJson().isStrictlyEqualTo(expected);
    }

    @Test
    void ordersEvolutionStagesBySpeciesIdAndUsesDefaultForms() {
        assertThat(mvc.get().uri("/api/v1/pokemon/raichu-alola/evolution"))
                .hasStatusOk()
                .bodyJson()
                .isLenientlyEqualTo("""
                        {
                          "chainId": 10,
                          "stages": [
                            { "speciesId": 25, "name": "pikachu", "evolvesFromSpeciesId": 172, "trigger": "level-up",
                              "minLevel": null },
                            { "speciesId": 26, "pokemonId": 26, "name": "raichu", "types": ["electric"],
                              "evolvesFromSpeciesId": 25, "trigger": "use-item" },
                            { "speciesId": 172, "name": "pichu", "evolvesFromSpeciesId": null, "trigger": null }
                          ]
                        }
                        """);
        assertThat(mvc.get().uri("/api/v1/pokemon/mewtwo/evolution"))
                .hasStatusOk()
                .bodyJson()
                .isLenientlyEqualTo("""
                        { "chainId": 77, "stages": [ { "speciesId": 150, "name": "mewtwo", "evolvesFromSpeciesId": null } ] }
                        """);
    }

    @Test
    void rejectsEvolutionOfUnknownOrMalformedPokemon() {
        assertThat(mvc.get().uri("/api/v1/pokemon/missingno/evolution"))
                .hasStatus(404)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("POKEMON_NOT_FOUND");
        assertThat(mvc.get().uri("/api/v1/pokemon/Pikachu/evolution"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("INVALID_PARAMETER");
    }

    @Test
    void servesTypeListAndMatrixFromLoadedData() {
        assertThat(mvc.get().uri("/api/v1/types"))
                .hasStatusOk()
                .hasHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .bodyJson()
                .satisfies(json -> {
                    assertThat(json).extractingPath("$.length()").isEqualTo(18);
                    assertThat(json).extractingPath("$[9]").isEqualTo(Map.of("id", 10, "name", "fire"));
                });
        assertThat(mvc.get().uri("/api/v1/types/matrix"))
                .hasStatusOk()
                .hasHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .bodyJson()
                .satisfies(json -> {
                    assertThat(json).extractingPath("$.types.length()").isEqualTo(18);
                    assertThat(json).extractingPath("$.multipliers[5][9]").isEqualTo(2.0);
                    assertThat(json).extractingPath("$.multipliers[0][7]").isEqualTo(0.0);
                });
    }

    @Test
    void findsGarchompByDragonTypeAndGenerationFour() {
        assertThat(mvc.get().uri("/api/v1/pokemon?type=dragon&gen=4"))
                .hasStatusOk()
                .bodyJson()
                .isLenientlyEqualTo("""
                        {
                          "content": [
                            { "id": 443, "name": "gible", "types": ["dragon", "ground"], "generation": 4 },
                            { "id": 444, "name": "gabite" },
                            { "id": 445, "name": "garchomp", "formCategory": "DEFAULT", "baseStatTotal": 600, "speed": 102 }
                          ],
                          "page": 0, "size": 24, "totalElements": 3, "totalPages": 1
                        }
                        """);
    }

    @Test
    void requiresEveryRequestedType() {
        assertThat(mvc.get().uri("/api/v1/pokemon?type=fire&type=flying"))
                .hasStatusOk()
                .bodyJson()
                .extractingPath("$.content[*].name").asArray().containsExactly("charizard");
    }

    @Test
    void hidesMegaGmaxAndOtherFormsByDefault() {
        assertThat(mvc.get().uri("/api/v1/pokemon?size=100"))
                .hasStatusOk()
                .bodyJson()
                .satisfies(json -> {
                    assertThat(json).extractingPath("$.totalElements").isEqualTo(28);
                    assertThat(json).extractingPath("$.content[*].formCategory").asArray()
                            .containsOnly("DEFAULT", "REGIONAL");
                });
        assertThat(mvc.get().uri("/api/v1/pokemon?form=MEGA"))
                .hasStatusOk()
                .bodyJson()
                .extractingPath("$.totalElements").isEqualTo(9);
    }

    @Test
    void sortsByRequestedPropertyThenId() {
        assertThat(mvc.get().uri("/api/v1/pokemon?sort=speed,desc&size=2"))
                .hasStatusOk()
                .bodyJson()
                .satisfies(json -> {
                    assertThat(json).extractingPath("$.content[*].name").asArray()
                            .containsExactly("jolteon", "mewtwo");
                    assertThat(json).extractingPath("$.totalPages").isEqualTo(14);
                });
    }

    @Test
    void rejectsSizeAboveOneHundred() {
        assertThat(mvc.get().uri("/api/v1/pokemon?size=101"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("INVALID_PARAMETER");
    }

    @Test
    void groupsDefaultAndRegionalFormsIntoSpeedTiersFastestFirst() {
        assertThat(mvc.get().uri("/api/v1/pokemon/speed-tiers"))
                .hasStatusOk()
                .hasHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                .bodyJson()
                .satisfies(json -> {
                    assertThat(json).extractingPath("$[*].pokemon[*]").asArray().hasSize(28);
                    assertThat(json).extractingPath("$[*].speed").asArray()
                            .isSortedAccordingTo((a, b) -> Integer.compare((Integer) b, (Integer) a))
                            .doesNotHaveDuplicates();
                    assertThat(json).extractingPath("$[?(@.speed == 102)].pokemon[*].name").asArray()
                            .containsExactly("garchomp");
                    assertThat(json).extractingPath("$[?(@.speed == 100)].pokemon[*].name").asArray()
                            .containsExactly("charizard", "ninetales", "mew", "salamence");
                    assertThat(json).extractingPath("$[*].pokemon[*].name").asArray()
                            .doesNotContain("charizard-mega-x", "garchomp-mega");
                });
    }

    @Test
    void rejectsUnknownTypeAndNonNumericGeneration() {
        assertThat(mvc.get().uri("/api/v1/pokemon?type=stellar"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("INVALID_PARAMETER");
        assertThat(mvc.get().uri("/api/v1/pokemon?gen=abc"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("INVALID_PARAMETER");
    }

    @Test
    void profilesEachGenerationOfTheSampleData() {
        assertThat(mvc.get().uri("/api/v1/pokemon/generations"))
                .hasStatusOk()
                .hasHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                .bodyJson()
                .satisfies(json -> {
                    assertThat(json).extractingPath("$[*].generation").asArray().containsExactly(1, 2, 3, 4);
                    assertThat(json).extractingPath("$[0].speciesCount").isEqualTo(15);
                    assertThat(json).extractingPath("$[0].legendaryCount").isEqualTo(1);
                    assertThat(json).extractingPath("$[0].mythicalCount").isEqualTo(1);
                    assertThat(json).extractingPath("$[0].strongest.name").isEqualTo("charizard");
                    assertThat(json).extractingPath("$[0].strongestBaseStatTotal").isEqualTo(534);
                    assertThat(json).extractingPath("$[0].topTypes").asArray().hasSize(3);
                    assertThat(json).extractingPath("$[3].strongest.name").isEqualTo("garchomp");
                });
    }
}
