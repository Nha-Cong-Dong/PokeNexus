package com.pokenexus.team.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.concurrent.atomic.AtomicInteger;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
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
class TeamControllerIT {

    private static final AtomicInteger CLIENTS = new AtomicInteger();
    private static final String SIX_MEMBER_TEAM = """
            {
              "name": "  Demo Team  ",
              "members": [
                { "slot": 6, "pokemonId": 150, "nickname": "Boss" },
                { "slot": 1, "pokemonId": 6, "nickname": null },
                { "slot": 2, "pokemonId": 445, "nickname": "Chomp" },
                { "slot": 3, "pokemonId": 373, "nickname": "" },
                { "slot": 4, "pokemonId": 134 },
                { "slot": 5, "pokemonId": 135, "nickname": "Volt" }
              ]
            }
            """;

    @Autowired
    private MockMvcTester mvc;

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void savesTeamAndOpensItByShareCode() throws Exception {
        double expectedScore = fullTeamScore();
        MvcTestResult created = save(SIX_MEMBER_TEAM, nextClient());

        assertThat(created).hasStatus(201);
        String shareCode = created.getResponse().getHeader(HttpHeaders.LOCATION).replace("/api/v1/teams/shared/", "");
        assertThat(shareCode).matches("[A-Za-z0-9]{8}");
        assertThat(created).bodyJson().satisfies(json -> {
            assertThat(json).isLenientlyEqualTo("""
                    {
                      "name": "Demo Team",
                      "members": [
                        { "slot": 1, "id": 6, "name": "charizard", "types": ["fire", "flying"], "nickname": null },
                        { "slot": 2, "id": 445, "name": "garchomp", "types": ["dragon", "ground"], "nickname": "Chomp" },
                        { "slot": 3, "id": 373, "name": "salamence", "nickname": null },
                        { "slot": 4, "id": 134, "name": "vaporeon", "nickname": null },
                        { "slot": 5, "id": 135, "name": "jolteon", "nickname": "Volt" },
                        { "slot": 6, "id": 150, "name": "mewtwo", "nickname": "Boss" }
                      ]
                    }
                    """);
            assertThat(json).extractingPath("$.shareCode").isEqualTo(shareCode);
            assertThat(json).extractingPath("$.createdAt").asString()
                    .matches("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z");
            assertThat(json).extractingPath("$.synergyScore").isEqualTo(expectedScore);
        });

        assertThat(mvc.get().uri("/api/v1/teams/shared/" + shareCode))
                .hasStatusOk()
                .bodyJson()
                .satisfies(json -> {
                    assertThat(json).extractingPath("$.members[*].id").asArray()
                            .containsExactly(6, 445, 373, 134, 135, 150);
                    assertThat(json).extractingPath("$.name").isEqualTo("Demo Team");
                    assertThat(json).extractingPath("$.synergyScore").isEqualTo(expectedScore);
                });
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM team_members tm JOIN teams t ON t.id = tm.team_id "
                + "WHERE t.share_code = ?", Integer.class, shareCode)).isEqualTo(6);
    }

    @Test
    void treatsShareCodesAsCaseSensitive() {
        MvcTestResult created = save("""
                { "name": "Solo", "members": [ { "slot": 1, "pokemonId": 6 } ] }
                """, nextClient());
        String shareCode = created.getResponse().getHeader(HttpHeaders.LOCATION).replace("/api/v1/teams/shared/", "");
        String swapped = swapCase(shareCode);

        assertThat(created).hasStatus(201).bodyJson().extractingPath("$.synergyScore").isEqualTo(76.0);
        if (!swapped.equals(shareCode)) {
            assertThat(mvc.get().uri("/api/v1/teams/shared/" + swapped))
                    .hasStatus(404)
                    .bodyJson()
                    .extractingPath("$.code").isEqualTo("TEAM_NOT_FOUND");
        }
    }

    @Test
    void returnsNotFoundAndBadRequestForUnknownOrMalformedShareCodes() {
        assertThat(mvc.get().uri("/api/v1/teams/shared/ZZZZZZZZ"))
                .hasStatus(404)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("TEAM_NOT_FOUND");
        assertThat(mvc.get().uri("/api/v1/teams/shared/abc"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("INVALID_PARAMETER");
    }

    @Test
    void rejectsInvalidTeams() {
        String client = nextClient();
        assertError(save("""
                { "name": "   ", "members": [ { "slot": 1, "pokemonId": 6 } ] }
                """, client), "VALIDATION_FAILED");
        assertError(save("""
                { "name": "T", "members": [] }
                """, client), "VALIDATION_FAILED");
        assertError(save("""
                { "name": "T", "members": [ { "slot": 7, "pokemonId": 6 } ] }
                """, client), "VALIDATION_FAILED");
        assertError(save("""
                { "name": "T", "members": [ { "slot": 1, "pokemonId": 6, "nickname": "%s" } ] }
                """.formatted("x".repeat(31)), client), "VALIDATION_FAILED");
        assertError(save("""
                { "name": "T", "members": [ { "slot": 1, "pokemonId": 6 }, { "slot": 1, "pokemonId": 445 } ] }
                """, client), "DUPLICATE_SLOT");
        assertError(save("""
                { "name": "T", "members": [ { "slot": 1, "pokemonId": 6 }, { "slot": 2, "pokemonId": 6 } ] }
                """, client), "DUPLICATE_POKEMON");
        assertError(save("""
                { "name": "T", "members": [ { "slot": 1, "pokemonId": 9999 } ] }
                """, client), "UNKNOWN_POKEMON");
    }

    @Test
    void limitsSavesToTenPerMinutePerClient() {
        String client = nextClient();
        String body = """
                { "name": "Spam", "members": [ { "slot": 1, "pokemonId": 25 } ] }
                """;
        for (int save = 0; save < 10; save++) {
            assertThat(save(body, client)).hasStatus(201);
        }

        MvcTestResult limited = save(body, client);

        assertThat(limited).hasStatus(429)
                .hasHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PROBLEM_JSON_VALUE)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("RATE_LIMITED");
        assertThat(Integer.parseInt(limited.getResponse().getHeader(HttpHeaders.RETRY_AFTER))).isBetween(1, 60);
        assertThat(save(body, nextClient())).hasStatus(201);
    }

    private double fullTeamScore() throws Exception {
        MvcTestResult analysis = mvc.post().uri("/api/v1/synergy/analyze")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"pokemonIds\": [6, 445, 373, 134, 135, 150]}")
                .exchange();
        assertThat(analysis).hasStatusOk();
        Number teamScore = JsonPath.read(analysis.getResponse().getContentAsString(), "$.teamScore");
        return teamScore.doubleValue();
    }

    private MvcTestResult save(String body, String client) {
        return mvc.post().uri("/api/v1/teams")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body)
                .with(request -> {
                    request.setRemoteAddr(client);
                    return request;
                })
                .exchange();
    }

    private static void assertError(MvcTestResult result, String code) {
        assertThat(result).hasStatus(400).bodyJson().extractingPath("$.code").isEqualTo(code);
    }

    private static String nextClient() {
        return "10.1.0." + CLIENTS.incrementAndGet();
    }

    private static String swapCase(String value) {
        StringBuilder swapped = new StringBuilder();
        for (char character : value.toCharArray()) {
            swapped.append(Character.isUpperCase(character)
                    ? Character.toLowerCase(character) : Character.toUpperCase(character));
        }
        return swapped.toString();
    }
}
