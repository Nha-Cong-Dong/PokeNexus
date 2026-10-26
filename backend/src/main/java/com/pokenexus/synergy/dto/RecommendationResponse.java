package com.pokenexus.synergy.dto;

import java.util.List;

public record RecommendationResponse(int candidateCount, List<Recommendation> items) {

    public record Recommendation(
            int id,
            String name,
            List<String> types,
            double score,
            Breakdown breakdown,
            int baseStatTotal,
            List<String> reasons) {
    }

    public record Breakdown(double defense, double offense, double stats) {
    }
}
