package com.pokenexus.synergy.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.ToDoubleFunction;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.synergy.dto.RecommendationRequest;
import com.pokenexus.synergy.dto.RecommendationResponse;
import com.pokenexus.synergy.dto.RecommendationResponse.Breakdown;
import com.pokenexus.synergy.dto.RecommendationResponse.Recommendation;
import com.pokenexus.synergy.model.PlayStyle;
import com.pokenexus.synergy.model.PokemonProfile;
import com.pokenexus.synergy.model.TeamAnalysis;
import com.pokenexus.synergy.model.TeamStatProfile;
import com.pokenexus.synergy.service.RoleScorer.RoleFit;

@Service
public class RecommendationEngine {

    public static final double HIGH_BST_SHARE = 0.25;
    public static final int SCORE_SCALE = 100;
    public static final int BREAKDOWN_DECIMALS = 3;
    public static final int MAX_TEAM_SIZE = SynergyAnalyzer.MAX_TEAM_SIZE - 1;
    public static final Set<Integer> PARADOX_POKEMON_IDS = Set.of(
            984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995,
            1005, 1006, 1009, 1010, 1020, 1021, 1022, 1023);

    private static final PokemonType[] TYPES = PokemonType.values();

    private final SynergyAnalyzer synergyAnalyzer;
    private final PokemonProfileRegistry registry;
    private final ReasonBuilder reasonBuilder;
    private final RoleScorer roleScorer;

    public RecommendationEngine(SynergyAnalyzer synergyAnalyzer, PokemonProfileRegistry registry,
                                ReasonBuilder reasonBuilder, RoleScorer roleScorer) {
        this.synergyAnalyzer = synergyAnalyzer;
        this.registry = registry;
        this.reasonBuilder = reasonBuilder;
        this.roleScorer = roleScorer;
    }

    public RecommendationResponse recommend(RecommendationRequest request) {
        List<PokemonProfile> team = synergyAnalyzer.resolveTeam(request.pokemonIds(), MAX_TEAM_SIZE);
        TeamAnalysis analysis = synergyAnalyzer.evaluate(team);
        TeamStatProfile teamStats = TeamStatProfile.of(team);
        PlayStyle style = request.playStyle();
        Set<Integer> teamIds = team.stream().map(PokemonProfile::id).collect(Collectors.toSet());
        List<PokemonProfile> candidates = registry.all().stream()
                .filter(profile -> isCandidate(profile, teamIds, request))
                .toList();
        if (candidates.isEmpty()) {
            return new RecommendationResponse(style, 0, List.of());
        }

        List<Scored> scored = candidates.stream()
                .map(candidate -> new Scored(candidate, defenseValue(candidate, analysis),
                        addedCoverage(candidate, analysis), roleScorer.score(candidate, teamStats, style)))
                .toList();
        Range defenseRange = Range.of(scored, Scored::defense);
        Range offenseRange = Range.of(scored, scoredCandidate -> scoredCandidate.addedCoverage().size());
        Range roleRange = Range.of(scored, scoredCandidate -> scoredCandidate.role().value());
        Range statsRange = Range.of(scored, scoredCandidate -> scoredCandidate.profile().baseStatTotal());
        int highBstThreshold = highBaseStatTotalThreshold(candidates);

        List<Ranked> ranked = scored.stream()
                .map(candidate -> rank(candidate, style, defenseRange, offenseRange, roleRange, statsRange))
                .sorted(Comparator.comparingDouble(Ranked::score).reversed()
                        .thenComparing(Comparator.comparingInt(
                                (Ranked rankedCandidate) -> rankedCandidate.scored().profile().baseStatTotal()).reversed())
                        .thenComparingInt(rankedCandidate -> rankedCandidate.scored().profile().id()))
                .toList();

        List<Recommendation> items = new ArrayList<>();
        Set<Set<PokemonType>> usedCombinations = new HashSet<>();
        for (Ranked candidate : ranked) {
            if (items.size() == request.limit()) {
                break;
            }
            PokemonProfile profile = candidate.scored().profile();
            if (!usedCombinations.add(profile.typeCombination())) {
                continue;
            }
            List<String> reasons = reasonBuilder.build(profile, analysis, candidate.scored().addedCoverage(),
                    candidate.scored().role().reasons(), profile.baseStatTotal() >= highBstThreshold);
            PokemonRef ref = profile.toRef();
            items.add(new Recommendation(ref.id(), ref.name(), ref.types(), candidate.score(), candidate.breakdown(),
                    profile.baseStatTotal(), reasons, reasonBuilder.cautions(profile, analysis)));
        }
        return new RecommendationResponse(style, candidates.size(), List.copyOf(items));
    }

    private static boolean isCandidate(PokemonProfile profile, Set<Integer> teamIds, RecommendationRequest request) {
        if (!profile.formCategory().isShownByDefault() || !profile.fullyEvolved() || teamIds.contains(profile.id())) {
            return false;
        }
        if (Boolean.TRUE.equals(request.excludeLegendary()) && isLegendaryLike(profile)) {
            return false;
        }
        if (!request.playStyle().allowsBaseSpeed(profile.stats().speed())) {
            return false;
        }
        return request.minBaseStatTotal() == null || profile.baseStatTotal() >= request.minBaseStatTotal();
    }

    static boolean isLegendaryLike(PokemonProfile profile) {
        return profile.legendary() || profile.mythical() || PARADOX_POKEMON_IDS.contains(profile.id());
    }

    static double defenseValue(PokemonProfile candidate, TeamAnalysis analysis) {
        double value = 0;
        for (PokemonType attacking : TYPES) {
            int score = candidate.defenseScore(attacking);
            int pressure = analysis.pressure(attacking);
            if (score > 0) {
                value += pressure * score;
            } else if (score < 0) {
                value -= (1 + pressure) * (-score);
            }
        }
        return value;
    }

    static List<PokemonType> addedCoverage(PokemonProfile candidate, TeamAnalysis analysis) {
        List<PokemonType> added = new ArrayList<>();
        for (PokemonType defending : TYPES) {
            if (!analysis.covered(defending) && candidate.hitsSuperEffectively(defending)) {
                added.add(defending);
            }
        }
        return List.copyOf(added);
    }

    static int highBaseStatTotalThreshold(List<PokemonProfile> candidates) {
        List<Integer> totals = candidates.stream()
                .map(PokemonProfile::baseStatTotal)
                .sorted(Comparator.reverseOrder())
                .toList();
        int topCount = Math.max(1, (int) Math.ceil(totals.size() * HIGH_BST_SHARE));
        return totals.get(topCount - 1);
    }

    private static Ranked rank(Scored candidate, PlayStyle style, Range defenseRange, Range offenseRange,
                               Range roleRange, Range statsRange) {
        double defense = defenseRange.normalize(candidate.defense());
        double offense = offenseRange.normalize(candidate.addedCoverage().size());
        double role = roleRange.normalize(candidate.role().value());
        double stats = statsRange.normalize(candidate.profile().baseStatTotal());
        double score = SCORE_SCALE * (style.defenseWeight() * defense + style.offenseWeight() * offense
                + style.roleWeight() * role + style.powerWeight() * stats);
        Breakdown breakdown = new Breakdown(
                SynergyAnalyzer.roundTo(defense, BREAKDOWN_DECIMALS),
                SynergyAnalyzer.roundTo(offense, BREAKDOWN_DECIMALS),
                SynergyAnalyzer.roundTo(role, BREAKDOWN_DECIMALS),
                SynergyAnalyzer.roundTo(stats, BREAKDOWN_DECIMALS));
        return new Ranked(candidate, SynergyAnalyzer.roundTo(score, 1), breakdown);
    }

    private record Scored(PokemonProfile profile, double defense, List<PokemonType> addedCoverage, RoleFit role) {
    }

    private record Ranked(Scored scored, double score, Breakdown breakdown) {
    }

    private record Range(double min, double max) {

        static Range of(List<Scored> candidates, ToDoubleFunction<Scored> value) {
            double min = candidates.stream().mapToDouble(value).min().orElse(0);
            double max = candidates.stream().mapToDouble(value).max().orElse(0);
            return new Range(min, max);
        }

        double normalize(double value) {
            if (max > min) {
                return (value - min) / (max - min);
            }
            return value > 0 ? 1 : 0;
        }
    }
}
