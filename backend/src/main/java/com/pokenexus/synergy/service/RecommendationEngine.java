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
import com.pokenexus.synergy.model.PokemonProfile;
import com.pokenexus.synergy.model.TeamAnalysis;

@Service
public class RecommendationEngine {

    public static final double DEFENSE_WEIGHT = 0.60;
    public static final double OFFENSE_WEIGHT = 0.25;
    public static final double STATS_WEIGHT = 0.15;
    public static final double HIGH_BST_SHARE = 0.25;
    public static final int SCORE_SCALE = 100;
    public static final int BREAKDOWN_DECIMALS = 3;

    private static final PokemonType[] TYPES = PokemonType.values();

    private final SynergyAnalyzer synergyAnalyzer;
    private final PokemonProfileRegistry registry;
    private final ReasonBuilder reasonBuilder;

    public RecommendationEngine(SynergyAnalyzer synergyAnalyzer, PokemonProfileRegistry registry,
                                ReasonBuilder reasonBuilder) {
        this.synergyAnalyzer = synergyAnalyzer;
        this.registry = registry;
        this.reasonBuilder = reasonBuilder;
    }

    public RecommendationResponse recommend(RecommendationRequest request) {
        List<PokemonProfile> team = synergyAnalyzer.resolveTeam(request.pokemonIds());
        TeamAnalysis analysis = synergyAnalyzer.evaluate(team);
        Set<Integer> teamIds = team.stream().map(PokemonProfile::id).collect(Collectors.toSet());
        List<PokemonProfile> candidates = registry.all().stream()
                .filter(profile -> isCandidate(profile, teamIds, request))
                .toList();
        if (candidates.isEmpty()) {
            return new RecommendationResponse(0, List.of());
        }

        boolean[][] superEffective = synergyAnalyzer.superEffectiveTable();
        List<Scored> scored = candidates.stream()
                .map(candidate -> new Scored(candidate, defenseValue(candidate, analysis),
                        addedCoverage(candidate, analysis, superEffective)))
                .toList();
        Range defenseRange = Range.of(scored, Scored::defense);
        Range offenseRange = Range.of(scored, scoredCandidate -> scoredCandidate.addedCoverage().size());
        Range statsRange = Range.of(scored, scoredCandidate -> scoredCandidate.profile().baseStatTotal());
        int highBstThreshold = highBaseStatTotalThreshold(candidates);

        List<Ranked> ranked = scored.stream()
                .map(candidate -> rank(candidate, defenseRange, offenseRange, statsRange))
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
                    profile.baseStatTotal() >= highBstThreshold);
            PokemonRef ref = profile.toRef();
            items.add(new Recommendation(ref.id(), ref.name(), ref.types(), candidate.score(), candidate.breakdown(),
                    profile.baseStatTotal(), reasons));
        }
        return new RecommendationResponse(candidates.size(), List.copyOf(items));
    }

    private static boolean isCandidate(PokemonProfile profile, Set<Integer> teamIds, RecommendationRequest request) {
        if (!profile.formCategory().isShownByDefault() || !profile.fullyEvolved() || teamIds.contains(profile.id())) {
            return false;
        }
        if (Boolean.TRUE.equals(request.excludeLegendary()) && (profile.legendary() || profile.mythical())) {
            return false;
        }
        return request.minBaseStatTotal() == null || profile.baseStatTotal() >= request.minBaseStatTotal();
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

    static List<PokemonType> addedCoverage(PokemonProfile candidate, TeamAnalysis analysis,
                                           boolean[][] superEffective) {
        List<PokemonType> added = new ArrayList<>();
        for (PokemonType defending : TYPES) {
            if (analysis.covered(defending)) {
                continue;
            }
            for (PokemonType attacking : candidate.types()) {
                if (superEffective[attacking.index()][defending.index()]) {
                    added.add(defending);
                    break;
                }
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

    private static Ranked rank(Scored candidate, Range defenseRange, Range offenseRange, Range statsRange) {
        double defense = defenseRange.normalize(candidate.defense());
        double offense = offenseRange.normalize(candidate.addedCoverage().size());
        double stats = statsRange.normalize(candidate.profile().baseStatTotal());
        double score = SCORE_SCALE * (DEFENSE_WEIGHT * defense + OFFENSE_WEIGHT * offense + STATS_WEIGHT * stats);
        Breakdown breakdown = new Breakdown(
                SynergyAnalyzer.roundTo(defense, BREAKDOWN_DECIMALS),
                SynergyAnalyzer.roundTo(offense, BREAKDOWN_DECIMALS),
                SynergyAnalyzer.roundTo(stats, BREAKDOWN_DECIMALS));
        return new Ranked(candidate, SynergyAnalyzer.roundTo(score, 1), breakdown);
    }

    private record Scored(PokemonProfile profile, double defense, List<PokemonType> addedCoverage) {
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
            return max > min ? (value - min) / (max - min) : 0;
        }
    }
}
