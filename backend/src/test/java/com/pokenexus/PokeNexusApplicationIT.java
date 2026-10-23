package com.pokenexus;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Testcontainers(disabledWithoutDocker = true)
class PokeNexusApplicationIT {

    @Autowired
    private MockMvcTester mvc;

    @Test
    void healthIsUpWithoutDataOnEmptyDatabase() {
        assertThat(mvc.get().uri("/api/v1/health"))
                .hasStatusOk()
                .bodyJson()
                .isLenientlyEqualTo("""
                        { "status": "UP", "dataLoaded": false, "pokemonCount": 0 }
                        """);
    }

    @Test
    void pokemonListIsUnavailableBeforeDataIsLoaded() {
        assertThat(mvc.get().uri("/api/v1/pokemon"))
                .hasStatus(503)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("DATA_NOT_READY");
    }

    @Test
    void exposesOpenApiDocumentForApiPaths() {
        assertThat(mvc.get().uri("/v3/api-docs"))
                .hasStatusOk()
                .bodyText()
                .contains("PokeNexus API")
                .contains("/api/v1/health");
    }

    @Test
    void servesSwaggerUi() {
        assertThat(mvc.get().uri("/swagger-ui.html"))
                .hasStatus3xxRedirection()
                .hasRedirectedUrl("/swagger-ui/index.html");
    }
}
