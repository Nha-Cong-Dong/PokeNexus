package com.pokenexus.pokedex.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.pokedex.dto.CompareResponse;
import com.pokenexus.pokedex.dto.CompareResponse.StatComparison;
import com.pokenexus.pokedex.dto.CompareResponse.TypeAdvantage;
import com.pokenexus.pokedex.dto.CompareResponse.Verdict;
import com.pokenexus.pokedex.dto.CompareResponse.Winner;
import com.pokenexus.pokedex.dto.PokemonDetail;
import com.pokenexus.typechart.service.TypeChartService;

@Service
public class CompareService {

    private final PokemonQueryService pokemonQueryService;
    private final TypeChartService typeChartService;

    public CompareService(PokemonQueryService pokemonQueryService, TypeChartService typeChartService) {
        this.pokemonQueryService = pokemonQueryService;
        this.typeChartService = typeChartService;
    }

    @Transactional(readOnly = true)
    public CompareResponse compare(String leftIdOrName, String rightIdOrName) {
        if (leftIdOrName.equals(rightIdOrName)) {
            throw sameOnBothSides();
        }
        PokemonDetail left = pokemonQueryService.findDetail(leftIdOrName);
        PokemonDetail right = pokemonQueryService.findDetail(rightIdOrName);
        if (left.id() == right.id()) {
            throw sameOnBothSides();
        }
        return new CompareResponse(left, right, verdict(left, right));
    }

    Verdict verdict(PokemonDetail left, PokemonDetail right) {
        double leftBest = bestStabMultiplier(left, right);
        double rightBest = bestStabMultiplier(right, left);
        TypeAdvantage typeAdvantage = new TypeAdvantage(leftBest, rightBest, Winner.of(leftBest, rightBest));
        StatComparison statTotal = compareStat(left.baseStatTotal(), right.baseStatTotal());
        StatComparison speed = compareStat(left.stats().speed(), right.stats().speed());
        List<String> summary = List.of(
                typeSentence(left, right, typeAdvantage),
                statTotalSentence(left, right, statTotal),
                speedSentence(left, right, speed));
        return new Verdict(typeAdvantage, statTotal, speed, summary);
    }

    private double bestStabMultiplier(PokemonDetail attacker, PokemonDetail defender) {
        List<PokemonType> defendingTypes = typesOf(defender);
        return typesOf(attacker).stream()
                .mapToDouble(attacking -> typeChartService.multiplier(attacking, defendingTypes))
                .max()
                .orElse(1.0);
    }

    private static StatComparison compareStat(int left, int right) {
        return new StatComparison(Math.abs(left - right), Winner.of(left, right));
    }

    private static String typeSentence(PokemonDetail left, PokemonDetail right, TypeAdvantage advantage) {
        return switch (advantage.winner()) {
            case LEFT -> "%s có lợi thế hệ (đòn cùng hệ tốt nhất x%s so với x%s).".formatted(
                    displayName(left), formatMultiplier(advantage.leftBestMultiplier()),
                    formatMultiplier(advantage.rightBestMultiplier()));
            case RIGHT -> "%s có lợi thế hệ (đòn cùng hệ tốt nhất x%s so với x%s).".formatted(
                    displayName(right), formatMultiplier(advantage.rightBestMultiplier()),
                    formatMultiplier(advantage.leftBestMultiplier()));
            case TIE -> "Hai bên cân bằng về hệ (đòn cùng hệ tốt nhất đều x%s).".formatted(
                    formatMultiplier(advantage.leftBestMultiplier()));
        };
    }

    private static String statTotalSentence(PokemonDetail left, PokemonDetail right, StatComparison comparison) {
        return switch (comparison.winner()) {
            case LEFT -> "%s có tổng chỉ số cao hơn (%d so với %d).".formatted(
                    displayName(left), left.baseStatTotal(), right.baseStatTotal());
            case RIGHT -> "%s có tổng chỉ số cao hơn (%d so với %d).".formatted(
                    displayName(right), right.baseStatTotal(), left.baseStatTotal());
            case TIE -> "Hai bên có tổng chỉ số bằng nhau (%d).".formatted(left.baseStatTotal());
        };
    }

    private static String speedSentence(PokemonDetail left, PokemonDetail right, StatComparison comparison) {
        int leftSpeed = left.stats().speed();
        int rightSpeed = right.stats().speed();
        return switch (comparison.winner()) {
            case LEFT -> "%s nhanh hơn (%d so với %d).".formatted(displayName(left), leftSpeed, rightSpeed);
            case RIGHT -> "%s nhanh hơn (%d so với %d).".formatted(displayName(right), rightSpeed, leftSpeed);
            case TIE -> "Hai bên có tốc độ bằng nhau (%d).".formatted(leftSpeed);
        };
    }

    private static List<PokemonType> typesOf(PokemonDetail pokemon) {
        return pokemon.types().stream()
                .map(name -> PokemonType.fromIdentifier(name)
                        .orElseThrow(() -> new IllegalStateException("Unknown type " + name)))
                .toList();
    }

    static String displayName(PokemonDetail pokemon) {
        return Arrays.stream(pokemon.name().split("-"))
                .filter(part -> !part.isEmpty())
                .map(part -> part.substring(0, 1).toUpperCase(Locale.ROOT) + part.substring(1))
                .collect(Collectors.joining("-"));
    }

    static String formatMultiplier(double multiplier) {
        return BigDecimal.valueOf(multiplier).stripTrailingZeros().toPlainString();
    }

    private static ApiException sameOnBothSides() {
        return new ApiException(ErrorCode.INVALID_PARAMETER, "left and right must be different Pokémon");
    }
}
