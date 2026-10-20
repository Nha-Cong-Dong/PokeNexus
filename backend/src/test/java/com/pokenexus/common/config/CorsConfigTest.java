package com.pokenexus.common.config;

import static org.assertj.core.api.Assertions.assertThat;

import com.pokenexus.common.web.HealthController;
import com.pokenexus.common.web.HealthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

@WebMvcTest(HealthController.class)
@TestPropertySource(properties = "app.cors.allowed-origins=http://localhost:5173")
class CorsConfigTest {

    @Autowired
    private MockMvcTester mvc;

    @MockitoBean
    private HealthService healthService;

    @Test
    void allowsPreflightFromConfiguredOrigin() {
        assertThat(mvc.options().uri("/api/v1/health")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .hasStatusOk()
                .headers()
                .hasValue(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173");
    }

    @Test
    void rejectsPreflightFromUnknownOrigin() {
        assertThat(mvc.options().uri("/api/v1/health")
                .header(HttpHeaders.ORIGIN, "http://evil.example")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .hasStatus(403)
                .headers()
                .doesNotContainHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN);
    }
}
