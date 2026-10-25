package com.pokenexus.pokedex.controller;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
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
}
