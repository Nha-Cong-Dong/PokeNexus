package com.pokenexus.synergy.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.pokedex.dto.Stats;
import com.pokenexus.synergy.dto.AnalyzeResponse;
import com.pokenexus.synergy.dto.AnalyzeResponse.OffensiveCoverage;
import com.pokenexus.synergy.dto.AnalyzeResponse.StatRadar;
import com.pokenexus.synergy.dto.AnalyzeResponse.TypeMatrixRow;
import com.pokenexus.synergy.model.PokemonProfile;
import com.pokenexus.synergy.model.TeamAnalysis;

@Service
public class SynergyAnalyzer {

    public static final int MIN_TEAM_SIZE = 1;
    public static final int MAX_TEAM_SIZE = 6;

    private static final PokemonType[] TYPES = PokemonType.values();

    private final PokemonProfileRegistry registry;

    public SynergyAnalyzer(PokemonProfileRegistry registry) {
        this.registry = registry;
    }

    public AnalyzeResponse analyze(List<Integer> pokemonIds) {
        return toResponse(evaluate(resolveTeam(pokemonIds, MAX_TEAM_SIZE)));
    }

    public List<PokemonProfile> resolveTeam(List<Integer> pokemonIds, int maxTeamSize) {
        if (pokemonIds == null || pokemonIds.size() < MIN_TEAM_SIZE || pokemonIds.size() > maxTeamSize) {
            throw new ApiException(ErrorCode.VALIDATION_FAILED,
                    "pokemonIds must contain between " + MIN_TEAM_SIZE + " and " + maxTeamSize + " Pokémon");
        }
        if (pokemonIds.stream().anyMatch(Objects::isNull)) {
            throw new ApiException(ErrorCode.VALIDATION_FAILED, "pokemonIds must not contain null");
        }
        Set<Integer> distinct = new LinkedHashSet<>(pokemonIds);
        if (distinct.size() != pokemonIds.size()) {
            throw new ApiException(ErrorCode.DUPLICATE_POKEMON, "pokemonIds must not contain the same Pokémon twice");
        }
        List<PokemonProfile> members = new ArrayList<>();
        List<Integer> unknown = new ArrayList<>();
        for (Integer id : pokemonIds) {
            Optional<PokemonProfile> profile = registry.find(id);
            profile.ifPresentOrElse(members::add, () -> unknown.add(id));
        }
        if (!unknown.isEmpty()) {
            throw new ApiException(ErrorCode.UNKNOWN_POKEMON, "Unknown Pokémon id(s): " + unknown);
        }
        return List.copyOf(members);
    }

    public TeamAnalysis evaluate(List<PokemonProfile> members) {
        boolean[] covered = new boolean[PokemonType.COUNT];
        for (PokemonProfile member : members) {
            for (PokemonType defending : TYPES) {
                covered[defending.index()] |= member.hitsSuperEffectively(defending);
            }
        }
        return new TeamAnalysis(members, covered);
    }

    public AnalyzeResponse toResponse(TeamAnalysis analysis) {
        List<PokemonProfile> members = analysis.members();
        List<TypeMatrixRow> rows = new ArrayList<>();
        List<String> uncovered = new ArrayList<>();
        for (PokemonType type : TYPES) {
            rows.add(new TypeMatrixRow(
                    type.identifier(),
                    members.stream().map(member -> member.defenseMultiplier(type)).toList(),
                    analysis.weakCount(type),
                    analysis.resistCount(type),
                    analysis.pressure(type),
                    analysis.criticalHole(type)));
            if (!analysis.covered(type)) {
                uncovered.add(type.identifier());
            }
        }
        StatRadar statRadar = new StatRadar(
                roundTo(analysis.averageStat(Stats::hp), 1),
                roundTo(analysis.averageStat(Stats::attack), 1),
                roundTo(analysis.averageStat(Stats::defense), 1),
                roundTo(analysis.averageStat(Stats::specialAttack), 1),
                roundTo(analysis.averageStat(Stats::specialDefense), 1),
                roundTo(analysis.averageStat(Stats::speed), 1));
        return new AnalyzeResponse(
                members.stream().map(PokemonProfile::toRef).toList(),
                roundTo(analysis.teamScore(), 1),
                List.copyOf(rows),
                new OffensiveCoverage(PokemonType.COUNT - uncovered.size(), List.copyOf(uncovered)),
                statRadar);
    }

    public static double roundTo(double value, int decimals) {
        return BigDecimal.valueOf(value).setScale(decimals, RoundingMode.HALF_UP).doubleValue();
    }
}
