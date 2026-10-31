package com.pokenexus.synergy.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Component;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.synergy.dto.AnalyzeResponse.InsightCategory;
import com.pokenexus.synergy.dto.AnalyzeResponse.InsightTone;
import com.pokenexus.synergy.dto.AnalyzeResponse.TeamInsight;
import com.pokenexus.synergy.model.PokemonProfile;
import com.pokenexus.synergy.model.TeamAnalysis;
import com.pokenexus.synergy.model.TeamStatProfile;

@Component
public class TeamInsightBuilder {

    public static final int MIN_TEAM_FOR_ROLE_INSIGHTS = 3;
    public static final int MAX_TYPE_INSIGHTS = 2;
    public static final int STACKED_WEAKNESS_COUNT = 3;
    public static final int MIN_RESIST_COUNT = 2;
    public static final int WIDE_COVERAGE = 14;
    public static final int MAX_LISTED_TYPES = 6;
    public static final int FAST_GROUP = 2;
    public static final int SHARED_TYPE_COUNT = 3;
    public static final double TRICK_ROOM_AVERAGE_SPEED = 60;
    public static final double DEFENSE_SKEW_THRESHOLD = 0.2;

    private static final PokemonType[] TYPES = PokemonType.values();

    public List<TeamInsight> build(TeamAnalysis analysis) {
        List<PokemonProfile> members = analysis.members();
        TeamStatProfile stats = TeamStatProfile.of(members);
        boolean roleInsights = members.size() >= MIN_TEAM_FOR_ROLE_INSIGHTS;
        List<TeamInsight> insights = new ArrayList<>();

        addResistedTypes(analysis, insights);
        boolean hasCriticalHole = Arrays.stream(TYPES).anyMatch(analysis::criticalHole);
        if (roleInsights && !hasCriticalHole) {
            insights.add(strength(InsightCategory.DEFENSE, "Không có lỗ hổng nghiêm trọng", List.of()));
        }
        List<PokemonType> uncovered = Arrays.stream(TYPES).filter(type -> !analysis.covered(type)).toList();
        int coverage = TYPES.length - uncovered.size();
        if (coverage >= WIDE_COVERAGE) {
            insights.add(strength(InsightCategory.OFFENSE,
                    "Độ phủ tấn công rộng: đánh siêu hiệu quả %d/%d hệ".formatted(coverage, TYPES.length), List.of()));
        }
        if (roleInsights) {
            addAttackBalance(members, insights);
            addSpeed(stats, insights);
            addDefenseBalance(stats, insights);
            addSharedTypes(members, insights);
        }

        addCriticalHoles(analysis, insights);
        addStackedWeaknesses(analysis, insights);
        if (roleInsights && coverage < WIDE_COVERAGE) {
            insights.add(weakness(InsightCategory.OFFENSE,
                    "Chưa đánh siêu hiệu quả được %d hệ: %s".formatted(uncovered.size(), listNames(uncovered)),
                    uncovered));
        }
        return insights.stream()
                .sorted(Comparator.comparing(TeamInsight::tone))
                .toList();
    }

    private static void addResistedTypes(TeamAnalysis analysis, List<TeamInsight> insights) {
        int needed = Math.max(MIN_RESIST_COUNT, (analysis.members().size() + 1) / 2);
        List<PokemonType> resisted = Arrays.stream(TYPES)
                .filter(type -> analysis.weakCount(type) == 0 && analysis.resistCount(type) >= needed)
                .sorted(Comparator.comparingInt(analysis::resistCount).reversed().thenComparingInt(PokemonType::id))
                .toList();
        if (!resisted.isEmpty()) {
            insights.add(strength(InsightCategory.DEFENSE,
                    "Chịu tốt hệ %s: từ %d thành viên kháng, không ai yếu".formatted(listNames(resisted), needed),
                    resisted));
        }
    }

    private static void addCriticalHoles(TeamAnalysis analysis, List<TeamInsight> insights) {
        Arrays.stream(TYPES)
                .filter(analysis::criticalHole)
                .sorted(Comparator.comparingInt(analysis::pressure).reversed().thenComparingInt(PokemonType::id))
                .limit(MAX_TYPE_INSIGHTS)
                .forEach(type -> insights.add(weakness(InsightCategory.DEFENSE,
                        "Lỗ hổng nghiêm trọng hệ %s: %d thành viên yếu, không ai kháng".formatted(
                                ReasonBuilder.displayName(type), analysis.weakCount(type)),
                        List.of(type))));
    }

    private static void addStackedWeaknesses(TeamAnalysis analysis, List<TeamInsight> insights) {
        Arrays.stream(TYPES)
                .filter(type -> !analysis.criticalHole(type) && analysis.weakCount(type) >= STACKED_WEAKNESS_COUNT)
                .sorted(Comparator.comparingInt(analysis::weakCount).reversed().thenComparingInt(PokemonType::id))
                .limit(MAX_TYPE_INSIGHTS)
                .forEach(type -> insights.add(weakness(InsightCategory.DEFENSE,
                        "%d thành viên cùng yếu hệ %s, chỉ %d kháng".formatted(analysis.weakCount(type),
                                ReasonBuilder.displayName(type), analysis.resistCount(type)),
                        List.of(type))));
    }

    private static void addAttackBalance(List<PokemonProfile> members, List<TeamInsight> insights) {
        int physical = 0;
        int special = 0;
        for (PokemonProfile member : members) {
            double lean = TeamStatProfile.attackLean(member.stats());
            physical += lean <= -TeamStatProfile.ATTACK_LEAN_THRESHOLD ? 1 : 0;
            special += lean >= TeamStatProfile.ATTACK_LEAN_THRESHOLD ? 1 : 0;
        }
        int mixed = members.size() - physical - special;
        if (special == 0 && mixed == 0) {
            insights.add(weakness(InsightCategory.BALANCE,
                    "Chỉ có sát thương vật lý: một đối thủ Phòng thủ cao có thể chặn cả đội", List.of()));
        } else if (physical == 0 && mixed == 0) {
            insights.add(weakness(InsightCategory.BALANCE,
                    "Chỉ có sát thương đặc biệt: một đối thủ Phòng thủ đặc biệt cao có thể chặn cả đội", List.of()));
        } else if (physical > 0 && special > 0) {
            insights.add(strength(InsightCategory.BALANCE,
                    "Cân bằng sát thương: %d vật lý, %d đặc biệt%s".formatted(physical, special,
                            mixed > 0 ? ", %d cả hai".formatted(mixed) : ""),
                    List.of()));
        }
    }

    private static void addSpeed(TeamStatProfile stats, List<TeamInsight> insights) {
        long averageSpeed = Math.round(stats.averageSpeed());
        if (stats.averageSpeed() <= TRICK_ROOM_AVERAGE_SPEED) {
            insights.add(strength(InsightCategory.SPEED,
                    "Đội chậm, hợp lối chơi Trick Room (tốc độ gốc trung bình %d)".formatted(averageSpeed), List.of()));
        } else if (stats.fastMembers() == 0) {
            insights.add(weakness(InsightCategory.SPEED,
                    "Chưa có thành viên nhanh (tốc độ gốc từ %d): dễ bị đánh trước".formatted(
                            TeamStatProfile.FAST_BASE_SPEED),
                    List.of()));
        } else if (stats.fastMembers() >= FAST_GROUP) {
            insights.add(strength(InsightCategory.SPEED,
                    "%d thành viên nhanh (tốc độ gốc từ %d)".formatted(stats.fastMembers(),
                            TeamStatProfile.FAST_BASE_SPEED),
                    List.of()));
        }
    }

    private static void addDefenseBalance(TeamStatProfile stats, List<TeamInsight> insights) {
        double skew = stats.defenseSkew();
        if (Math.abs(skew) < DEFENSE_SKEW_THRESHOLD) {
            return;
        }
        boolean specialWeaker = skew < 0;
        insights.add(weakness(InsightCategory.BALANCE,
                "%s yếu hơn hẳn %s (trung bình %d so với %d)".formatted(
                        specialWeaker ? "Phòng thủ đặc biệt" : "Phòng thủ vật lý",
                        specialWeaker ? "phòng thủ vật lý" : "phòng thủ đặc biệt",
                        Math.round(specialWeaker ? stats.averageSpecialDefense() : stats.averageDefense()),
                        Math.round(specialWeaker ? stats.averageDefense() : stats.averageSpecialDefense())),
                List.of()));
    }

    private static void addSharedTypes(List<PokemonProfile> members, List<TeamInsight> insights) {
        Arrays.stream(TYPES)
                .filter(type -> members.stream().filter(member -> member.types().contains(type)).count()
                        >= SHARED_TYPE_COUNT)
                .findFirst()
                .ifPresent(type -> insights.add(weakness(InsightCategory.BALANCE,
                        "%d thành viên cùng hệ %s: dễ bị một hệ tấn công khắc chế".formatted(
                                members.stream().filter(member -> member.types().contains(type)).count(),
                                ReasonBuilder.displayName(type)),
                        List.of(type))));
    }

    private static String listNames(List<PokemonType> types) {
        String listed = ReasonBuilder.joinNames(types.stream().limit(MAX_LISTED_TYPES).toList());
        return types.size() > MAX_LISTED_TYPES
                ? "%s và %d hệ khác".formatted(listed, types.size() - MAX_LISTED_TYPES)
                : listed;
    }

    private static TeamInsight strength(InsightCategory category, String text, List<PokemonType> types) {
        return new TeamInsight(InsightTone.STRENGTH, category, text, identifiers(types));
    }

    private static TeamInsight weakness(InsightCategory category, String text, List<PokemonType> types) {
        return new TeamInsight(InsightTone.WEAKNESS, category, text, identifiers(types));
    }

    private static List<String> identifiers(List<PokemonType> types) {
        return types.stream().map(PokemonType::identifier).toList();
    }
}
