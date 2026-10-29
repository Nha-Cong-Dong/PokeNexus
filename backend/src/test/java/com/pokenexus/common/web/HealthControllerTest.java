package com.pokenexus.common.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

@WebMvcTest(HealthController.class)
class HealthControllerTest {

    @Autowired
    private MockMvcTester mvc;

    @MockitoBean
    private HealthService healthService;

    @Test
    void returnsHealthAsJson() {
        when(healthService.check()).thenReturn(HealthResponse.up(1351));

        assertThat(mvc.get().uri("/api/v1/health"))
                .hasStatusOk()
                .hasContentTypeCompatibleWith(MediaType.APPLICATION_JSON)
                .bodyJson()
                .isLenientlyEqualTo("""
                        { "status": "UP", "dataLoaded": true, "pokemonCount": 1351 }
                        """);
    }

    @Test
    void returnsServiceUnavailableWhenDatabaseIsDown() {
        when(healthService.check()).thenReturn(new HealthResponse("DOWN", false, 0));

        assertThat(mvc.get().uri("/api/v1/health"))
                .hasStatus(503)
                .hasContentTypeCompatibleWith(MediaType.APPLICATION_JSON)
                .bodyJson()
                .isLenientlyEqualTo("""
                        { "status": "DOWN", "dataLoaded": false, "pokemonCount": 0 }
                        """);
    }

    @Test
    void rejectsUnsupportedMethodWithProblemDetail() {
        assertThat(mvc.post().uri("/api/v1/health"))
                .hasStatus(405)
                .hasContentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
                .bodyJson()
                .extractingPath("$.code")
                .isEqualTo("INVALID_PARAMETER");
    }
}
