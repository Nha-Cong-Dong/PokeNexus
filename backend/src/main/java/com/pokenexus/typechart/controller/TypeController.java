package com.pokenexus.typechart.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pokenexus.typechart.dto.TypeMatrixResponse;
import com.pokenexus.typechart.dto.TypeResponse;
import com.pokenexus.typechart.service.TypeChartService;

@RestController
@RequestMapping("/api/v1/types")
@Tag(name = "Type chart")
public class TypeController {

    public static final String CACHE_ONE_DAY = "public, max-age=86400";

    private final TypeChartService typeChartService;

    public TypeController(TypeChartService typeChartService) {
        this.typeChartService = typeChartService;
    }

    @GetMapping
    @Operation(summary = "The 18 standard types ordered by id")
    public ResponseEntity<List<TypeResponse>> types() {
        return ResponseEntity.ok().header(HttpHeaders.CACHE_CONTROL, CACHE_ONE_DAY).body(typeChartService.types());
    }

    @GetMapping("/matrix")
    @Operation(summary = "18 x 18 effectiveness matrix: multipliers[attacking][defending]")
    public ResponseEntity<TypeMatrixResponse> matrix() {
        return ResponseEntity.ok().header(HttpHeaders.CACHE_CONTROL, CACHE_ONE_DAY).body(typeChartService.matrix());
    }
}
