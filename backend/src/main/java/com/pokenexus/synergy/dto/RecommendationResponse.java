package com.pokenexus.synergy.dto;

import java.util.List;

import com.pokenexus.synergy.model.PlayStyle;

public record RecommendationResponse(PlayStyle playStyle, int candidateCount, List<Recommendation> items) {

    public record Recommendation(
            int id,
            String name,
            List<String> types,
            double score,
            Breakdown breakdown,
            int baseStatTotal,
            List<String> reasons,
            List<String> cautions) {
    }

    public record Breakdown(double defense, double offense, double role, double stats) {
    }
}
