package com.pokenexus.common.exception;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@WebMvcTest(controllers = GlobalExceptionHandlerTest.ProbeController.class)
@Import(GlobalExceptionHandlerTest.ProbeController.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvcTester mvc;

    @Test
    void mapsApiExceptionToProblemDetailWithCode() {
        assertThat(mvc.get().uri("/probe/not-found"))
                .hasStatus(404)
                .hasContentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
                .bodyJson()
                .isLenientlyEqualTo("""
                        {
                          "status": 404,
                          "title": "Not Found",
                          "detail": "Pokemon 'missingno' not found",
                          "instance": "/probe/not-found",
                          "code": "POKEMON_NOT_FOUND"
                        }
                        """);
    }

    @Test
    void mapsBodyValidationToValidationFailedWithFieldErrors() {
        assertThat(mvc.post().uri("/probe/body")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\": \"\"}"))
                .hasStatus(400)
                .bodyJson()
                .isLenientlyEqualTo("""
                        {
                          "detail": "Request validation failed",
                          "code": "VALIDATION_FAILED",
                          "errors": [ { "field": "name" } ]
                        }
                        """);
    }

    @Test
    void mapsUnreadableBodyToMalformedJson() {
        assertThat(mvc.post().uri("/probe/body")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\": "))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code")
                .isEqualTo("MALFORMED_JSON");
    }

    @Test
    void mapsWrongParameterTypeToInvalidParameter() {
        assertThat(mvc.get().uri("/probe/size").param("size", "abc"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code")
                .isEqualTo("INVALID_PARAMETER");
    }

    @Test
    void mapsParameterConstraintViolationToInvalidParameter() {
        assertThat(mvc.get().uri("/probe/size").param("size", "101"))
                .hasStatus(400)
                .bodyJson()
                .extractingPath("$.code")
                .isEqualTo("INVALID_PARAMETER");
    }

    @Test
    void mapsUnknownRouteToRouteNotFound() {
        assertThat(mvc.get().uri("/api/v1/does-not-exist"))
                .hasStatus(404)
                .bodyJson()
                .extractingPath("$.code")
                .isEqualTo("ROUTE_NOT_FOUND");
    }

    @Test
    void hidesInternalDetailsOnUnexpectedError() {
        assertThat(mvc.get().uri("/probe/boom"))
                .hasStatus(500)
                .hasContentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
                .bodyText()
                .contains("INTERNAL_ERROR")
                .doesNotContain("secret-connection-string")
                .doesNotContain("IllegalStateException");
    }

    record ProbeRequest(@NotBlank String name) {
    }

    @RestController
    @RequestMapping("/probe")
    static class ProbeController {

        @GetMapping("/not-found")
        String notFound() {
            throw new NotFoundException(ErrorCode.POKEMON_NOT_FOUND, "Pokemon 'missingno' not found");
        }

        @PostMapping("/body")
        String body(@Valid @RequestBody ProbeRequest request) {
            return request.name();
        }

        @GetMapping("/size")
        int size(@RequestParam @Max(100) int size) {
            return size;
        }

        @GetMapping("/boom")
        String boom() {
            throw new IllegalStateException("secret-connection-string");
        }
    }
}
