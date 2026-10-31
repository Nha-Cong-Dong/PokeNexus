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
    public static final int MAX_ROLE_REASONS = 2;
    public static final int MAX_REASONS = 4;
    public static final int MAX_STACKED_WEAKNESS_CAUTIONS = 2;
    public static final int STACKED_WEAKNESS_COUNT = 2;
    public static final int SHARED_TYPE_COUNT = 2;

    public List<String> build(PokemonProfile candidate, TeamAnalysis analysis, List<PokemonType> addedCoverage,
                              List<String> roleReasons, boolean highBaseStatTotal) {
        List<String> reasons = new ArrayList<>();
        Arrays.stream(PokemonType.values())
                .filter(type -> candidate.defenseScore(type) > 0 && analysis.pressure(type) > 0)
                .sorted(Comparator.comparingInt(analysis::pressure).reversed().thenComparingInt(PokemonType::id))
                .limit(MAX_RESISTANCE_REASONS)
                .forEach(type -> reasons.add(resistanceReason(candidate, analysis, type)));
        roleReasons.stream().limit(MAX_ROLE_REASONS).forEach(reasons::add);
        if (!addedCoverage.isEmpty()) {
            reasons.add("Đánh siêu hiệu quả hệ %s mà đội chưa phủ được".formatted(joinNames(addedCoverage)));
        }
        if (highBaseStatTotal) {
            reasons.add("Tổng chỉ số cao (BST %d)".formatted(candidate.baseStatTotal()));
        } else if (reasons.isEmpty()) {
            reasons.add("Tổng chỉ số BST %d".formatted(candidate.baseStatTotal()));
        }
        return reasons.stream().limit(MAX_REASONS).toList();
    }

    public List<String> cautions(PokemonProfile candidate, TeamAnalysis analysis) {
        List<String> cautions = new ArrayList<>();
        Arrays.stream(PokemonType.values())
                .filter(type -> candidate.defenseScore(type) < 0
                        && analysis.weakCount(type) >= STACKED_WEAKNESS_COUNT)
                .sorted(Comparator.comparingInt(analysis::weakCount).reversed().thenComparingInt(PokemonType::id))
                .limit(MAX_STACKED_WEAKNESS_CAUTIONS)
                .forEach(type -> cautions.add("Thêm điểm yếu hệ %s: đội đã có %d thành viên yếu".formatted(
                        displayName(type), analysis.weakCount(type))));
        candidate.types().stream()
                .map(type -> new SharedType(type, (int) analysis.members().stream()
                        .filter(member -> member.types().contains(type))
                        .count()))
                .filter(shared -> shared.count() >= SHARED_TYPE_COUNT)
                .max(Comparator.comparingInt(SharedType::count))
                .ifPresent(shared -> cautions.add("Trùng hệ %s với %d thành viên".formatted(
                        displayName(shared.type()), shared.count())));
        return List.copyOf(cautions);
    }

    private static String resistanceReason(PokemonProfile candidate, TeamAnalysis analysis, PokemonType type) {
        double multiplier = candidate.defenseMultiplier(type);
        String weakMembers = analysis.resistCount(type) == 0
                ? "%d thành viên yếu, chưa ai kháng".formatted(analysis.weakCount(type))
                : "%d thành viên yếu, %d kháng".formatted(analysis.weakCount(type), analysis.resistCount(type));
        if (multiplier == 0) {
            return "Miễn nhiễm hệ %s: đội đang có %s".formatted(displayName(type), weakMembers);
        }
        return "Kháng hệ %s (x%s): đội đang có %s".formatted(displayName(type), formatMultiplier(multiplier),
                weakMembers);
    }

    static String formatMultiplier(double multiplier) {
        return multiplier == 0.25 ? "0,25" : "0,5";
    }

    static String joinNames(List<PokemonType> types) {
        return types.stream().map(ReasonBuilder::displayName).collect(Collectors.joining(", "));
    }

    static String displayName(PokemonType type) {
        String identifier = type.identifier();
        return identifier.substring(0, 1).toUpperCase(Locale.ROOT) + identifier.substring(1);
    }

    private record SharedType(PokemonType type, int count) {
    }
}
