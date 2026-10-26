package com.pokenexus.synergy.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.synergy.model.PokemonProfile;
import com.pokenexus.synergy.model.TeamAnalysis;

@Service
public class ReasonBuilder {

    public static final int MAX_RESISTANCE_REASONS = 2;

    public List<String> build(PokemonProfile candidate, TeamAnalysis analysis, List<PokemonType> addedCoverage,
                              boolean highBaseStatTotal) {
        List<String> reasons = new ArrayList<>();
        Arrays.stream(PokemonType.values())
                .filter(type -> candidate.defenseScore(type) > 0 && analysis.pressure(type) > 0)
                .sorted(Comparator.comparingInt(analysis::pressure).reversed().thenComparingInt(PokemonType::id))
                .limit(MAX_RESISTANCE_REASONS)
                .forEach(type -> reasons.add("Chống chịu hệ %s (đội đang hở mức %d)"
                        .formatted(displayName(type), analysis.pressure(type))));
        if (!addedCoverage.isEmpty()) {
            reasons.add("Bổ sung độ phủ tấn công lên hệ " + addedCoverage.stream()
                    .map(ReasonBuilder::displayName)
                    .collect(Collectors.joining(", ")));
        }
        if (highBaseStatTotal) {
            reasons.add("Tổng chỉ số cao (BST %d)".formatted(candidate.baseStatTotal()));
        } else if (reasons.isEmpty()) {
            reasons.add("Tổng chỉ số BST %d".formatted(candidate.baseStatTotal()));
        }
        return List.copyOf(reasons);
    }

    static String displayName(PokemonType type) {
        String identifier = type.identifier();
        return identifier.substring(0, 1).toUpperCase(Locale.ROOT) + identifier.substring(1);
    }
}
