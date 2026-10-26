package com.pokenexus.typechart.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.typechart.dto.TypeMatrixResponse;
import com.pokenexus.typechart.dto.TypeResponse;
import com.pokenexus.typechart.service.TypeChartService;

@WebMvcTest(TypeController.class)
class TypeControllerTest {

    @Autowired
    private MockMvcTester mvc;

    @MockitoBean
    private TypeChartService typeChartService;

    @Test
    void listsTypesWithOneDayPublicCache() {
        when(typeChartService.types()).thenReturn(List.of(new TypeResponse(1, "normal"), new TypeResponse(10, "fire")));

        assertThat(mvc.get().uri("/api/v1/types"))
                .hasStatusOk()
                .hasHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .bodyJson()
                .isStrictlyEqualTo("""
                        [ { "id": 1, "name": "normal" }, { "id": 10, "name": "fire" } ]
                        """);
    }

    @Test
    void returnsMatrixWithOneDayPublicCache() {
        when(typeChartService.matrix()).thenReturn(new TypeMatrixResponse(
                List.of("normal", "ghost"), List.of(List.of(1.0, 0.0), List.of(0.0, 2.0))));

        assertThat(mvc.get().uri("/api/v1/types/matrix"))
                .hasStatusOk()
                .hasHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .bodyJson()
                .isLenientlyEqualTo("""
                        { "types": ["normal", "ghost"], "multipliers": [[1.0, 0.0], [0.0, 2.0]] }
                        """);
    }

    @Test
    void returnsServiceUnavailableBeforeTypeChartIsLoaded() {
        when(typeChartService.matrix())
                .thenThrow(new ApiException(ErrorCode.DATA_NOT_READY, "Type chart data has not been loaded yet"));

        assertThat(mvc.get().uri("/api/v1/types/matrix"))
                .hasStatus(503)
                .bodyJson()
                .extractingPath("$.code").isEqualTo("DATA_NOT_READY");
    }
}
