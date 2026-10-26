package com.pokenexus.synergy.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pokenexus.synergy.dto.AnalyzeRequest;
import com.pokenexus.synergy.dto.AnalyzeResponse;
import com.pokenexus.synergy.dto.RecommendationRequest;
import com.pokenexus.synergy.dto.RecommendationResponse;
import com.pokenexus.synergy.service.RecommendationEngine;
import com.pokenexus.synergy.service.SynergyAnalyzer;

@RestController
@RequestMapping("/api/v1/synergy")
@Tag(name = "Synergy")
public class SynergyController {

    private final SynergyAnalyzer synergyAnalyzer;
    private final RecommendationEngine recommendationEngine;

    public SynergyController(SynergyAnalyzer synergyAnalyzer, RecommendationEngine recommendationEngine) {
        this.synergyAnalyzer = synergyAnalyzer;
        this.recommendationEngine = recommendationEngine;
    }

    @PostMapping("/analyze")
    @Operation(summary = "Analyze the defensive synergy of a team of 1-5 Pokémon")
    public AnalyzeResponse analyze(@Valid @RequestBody AnalyzeRequest request) {
        return synergyAnalyzer.analyze(request.pokemonIds());
    }

    @PostMapping("/recommendations")
    @Operation(summary = "Recommend Pokémon for the next team slot, one per type combination")
    public RecommendationResponse recommend(@Valid @RequestBody RecommendationRequest request) {
        return recommendationEngine.recommend(request);
    }
}
