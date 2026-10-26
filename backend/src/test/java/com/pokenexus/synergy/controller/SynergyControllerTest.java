package com.pokenexus.synergy.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.synergy.dto.AnalyzeResponse;
import com.pokenexus.synergy.dto.RecommendationRequest;
import com.pokenexus.synergy.dto.RecommendationResponse;
import com.pokenexus.synergy.service.RecommendationEngine;
import com.pokenexus.synergy.service.SynergyAnalyzer;

@WebMvcTest(SynergyController.class)
class SynergyControllerTest {

    @Autowired
    private MockMvcTester mvc;

    @MockitoBean
    private SynergyAnalyzer synergyAnalyzer;

    @MockitoBean
    private RecommendationEngine recommendationEngine;

    @Test
    void analyzesTeamAndReturnsJson() {
        when(synergyAnalyzer.analyze(List.of(6))).thenReturn(new AnalyzeResponse(
                List.of(new PokemonRef(6, "charizard", List.of("fire", "flying"))),
                76.0,
                List.of(new AnalyzeResponse.TypeMatrixRow("rock", List.of(4.0), 1, 0, 2, true)),
                new AnalyzeResponse.OffensiveCoverage(6, List.of("normal")),
                new AnalyzeResponse.StatRadar(78, 84, 78, 109, 85, 100)));

        assertThat(post("/api/v1/synergy/analyze", "{\"pokemonIds\": [6]}"))
                .hasStatusOk()
                .bodyJson()
                .isLenientlyEqualTo("""
                        {
                          "members": [ { "id": 6, "name": "charizard", "types": ["fire", "flying"] } ],
                          "teamScore": 76.0,
                          "typeMatrix": [
                            { "attackingType": "rock", "multipliers": [4.0], "weakCount": 1, "resistCount": 0,
                              "pressure": 2, "criticalHole": true }
                          ],
                          "offensiveCoverage": { "coveredTypeCount": 6, "uncoveredTypes": ["normal"] },
                          "statRadar": { "hp": 78.0, "attack": 84.0, "defense": 78.0, "specialAttack": 109.0,
                                         "specialDefense": 85.0, "speed": 100.0 }
                        }
                        """);
    }

    @Test
    void rejectsSixPokemonWithValidationErrors() {
        assertThat(post("/api/v1/synergy/analyze", "{\"pokemonIds\": [6, 130, 149, 663, 637, 445]}"))
                .hasStatus(400)
                .bodyJson()
                .isLenientlyEqualTo("""
                        {
                          "code": "VALIDATION_FAILED",
                          "errors": [ { "field": "pokemonIds", "message": "size must be between 1 and 5" } ]
                        }
                        """);
        verifyNoInteractions(synergyAnalyzer);
    }

    @Test
    void rejectsEmptyMissingAndNullIds() {
        for (String body : List.of("{\"pokemonIds\": []}", "{}", "{\"pokemonIds\": [6, null]}")) {
            assertThat(post("/api/v1/synergy/analyze", body))
                    .hasStatus(400)
                    .bodyJson()
                    .extractingPath("$.code").isEqualTo("VALIDATION_FAILED");
        }
    }

    @Test
    void rejectsMalformedJson() {
        assertThat(post("/api/v1/synergy/analyze", "{\"pokemonIds\": [6,"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("MALFORMED_JSON");
    }

    @Test
    void passesBusinessErrorsThrough() {
        when(synergyAnalyzer.analyze(List.of(6, 6)))
                .thenThrow(new ApiException(ErrorCode.DUPLICATE_POKEMON, "duplicate"));

        assertThat(post("/api/v1/synergy/analyze", "{\"pokemonIds\": [6, 6]}"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("DUPLICATE_POKEMON");
    }

    @Test
    void recommendsWithDefaults() {
        when(recommendationEngine.recommend(any(RecommendationRequest.class))).thenReturn(
                new RecommendationResponse(412, List.of(new RecommendationResponse.Recommendation(
                        530, "excadrill", List.of("ground", "steel"), 86.8,
                        new RecommendationResponse.Breakdown(1.0, 1.0, 0.118), 508,
                        List.of("Chống chịu hệ Rock (đội đang hở mức 8)")))));

        assertThat(post("/api/v1/synergy/recommendations", "{\"pokemonIds\": [6, 130]}"))
                .hasStatusOk()
                .bodyJson()
                .isLenientlyEqualTo("""
                        {
                          "candidateCount": 412,
                          "items": [
                            { "id": 530, "name": "excadrill", "types": ["ground", "steel"], "score": 86.8,
                              "breakdown": { "defense": 1.0, "offense": 1.0, "stats": 0.118 },
                              "baseStatTotal": 508, "reasons": ["Chống chịu hệ Rock (đội đang hở mức 8)"] }
                          ]
                        }
                        """);
    }

    @Test
    void rejectsOutOfRangeRecommendationOptions() {
        for (String body : List.of(
                "{\"pokemonIds\": [6], \"limit\": 11}",
                "{\"pokemonIds\": [6], \"limit\": 0}",
                "{\"pokemonIds\": [6], \"minBaseStatTotal\": 1531}",
                "{\"pokemonIds\": [6, 130, 149, 663, 637, 445]}")) {
            assertThat(post("/api/v1/synergy/recommendations", body))
                    .hasStatus(400)
                    .bodyJson()
                    .extractingPath("$.code").isEqualTo("VALIDATION_FAILED");
        }
        verifyNoInteractions(recommendationEngine);
    }

    private MockMvcTester.MockMvcRequestBuilder post(String uri, String body) {
        return mvc.post().uri(uri).contentType(MediaType.APPLICATION_JSON).content(body);
    }
}
