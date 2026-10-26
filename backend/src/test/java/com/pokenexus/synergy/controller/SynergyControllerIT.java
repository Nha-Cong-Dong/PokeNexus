package com.pokenexus.synergy.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.pokenexus.TestcontainersConfiguration;

@SpringBootTest(properties = "app.ingestion.enabled=true")
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Testcontainers(disabledWithoutDocker = true)
class SynergyControllerIT {

    @Autowired
    private MockMvcTester mvc;

    @Test
    void reportsDataLoadedOnceProfilesAreInMemory() {
        assertThat(mvc.get().uri("/api/v1/health"))
                .hasStatusOk()
                .bodyJson()
                .isLenientlyEqualTo("""
                        { "status": "UP", "dataLoaded": true, "pokemonCount": 62 }
                        """);
    }

    @Test
    void analyzesCharizardFromSampleData() {
        assertThat(post("/api/v1/synergy/analyze", "{\"pokemonIds\": [6]}"))
                .hasStatusOk()
                .bodyJson()
                .satisfies(json -> {
                    assertThat(json).extractingPath("$.teamScore").isEqualTo(76.0);
                    assertThat(json).extractingPath("$.typeMatrix.length()").isEqualTo(18);
                    assertThat(json).extractingPath("$.typeMatrix[5]").isEqualTo(Map.of(
                            "attackingType", "rock", "multipliers", List.of(4.0), "weakCount", 1,
                            "resistCount", 0, "pressure", 2, "criticalHole", true));
                    assertThat(json).extractingPath("$.members[0].name").isEqualTo("charizard");
                });
    }

    @Test
    void acceptsMegaFormsInTheTeam() {
        assertThat(post("/api/v1/synergy/analyze", "{\"pokemonIds\": [10034, 445]}"))
                .hasStatusOk()
                .bodyJson()
                .extractingPath("$.members[*].name").asArray()
                .containsExactly("charizard-mega-x", "garchomp");
    }

    @Test
    void rejectsTooManyDuplicateAndUnknownIds() {
        assertThat(post("/api/v1/synergy/analyze", "{\"pokemonIds\": [4, 5, 6, 25, 26, 445]}"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("VALIDATION_FAILED");
        assertThat(post("/api/v1/synergy/analyze", "{\"pokemonIds\": [6, 6]}"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("DUPLICATE_POKEMON");
        assertThat(post("/api/v1/synergy/recommendations", "{\"pokemonIds\": [6, 9999]}"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("UNKNOWN_POKEMON");
    }

    @Test
    void recommendsFullyEvolvedDistinctCandidates() {
        MvcTestResult result = post("/api/v1/synergy/recommendations", "{\"pokemonIds\": [6, 445]}");

        assertThat(result).hasStatusOk().bodyJson().satisfies(json -> {
            assertThat(json).extractingPath("$.items.length()").isEqualTo(3);
            assertThat(json).extractingPath("$.items[*].id").asArray()
                    .doesNotContain(6, 445, 4, 5, 443, 444, 10034, 10035, 10058)
                    .allSatisfy(id -> assertThat((Integer) id).isNotIn(19, 25, 37, 133, 172, 371, 372, 10091, 10103));
            assertThat(json).extractingPath("$.items[0].reasons").asArray().isNotEmpty();
            assertThat(json).extractingPath("$.items[*].types").asArray().satisfies(types -> {
                Set<Object> combinations = new HashSet<>();
                for (Object combination : types) {
                    assertThat(combinations.add(Set.copyOf((List<?>) combination))).isTrue();
                }
            });
        });
    }

    private MvcTestResult post(String uri, String body) {
        return mvc.post().uri(uri).contentType(MediaType.APPLICATION_JSON).content(body).exchange();
    }
}
