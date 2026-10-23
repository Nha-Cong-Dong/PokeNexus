package com.pokenexus.pokedex.dto;

import java.util.EnumSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;

public record PokemonFilter(
        Set<PokemonType> types,
        Integer generation,
        Integer minBst,
        Integer maxBst,
        Integer minSpeed,
        Set<FormCategory> forms) {

    public static final int MAX_TYPES = 2;
    public static final int MAX_GENERATION = 9;
    public static final int MAX_BST = 1530;
    public static final int MAX_SPEED = 255;

    public static PokemonFilter of(List<String> types, Integer generation, Integer minBst, Integer maxBst,
                                   Integer minSpeed, List<String> forms) {
        requireRange("gen", generation, 1, MAX_GENERATION);
        requireRange("minBst", minBst, 0, MAX_BST);
        requireRange("maxBst", maxBst, 0, MAX_BST);
        requireRange("minSpeed", minSpeed, 0, MAX_SPEED);
        if (minBst != null && maxBst != null && minBst > maxBst) {
            throw invalid("minBst must be <= maxBst");
        }
        return new PokemonFilter(parseTypes(types), generation, minBst, maxBst, minSpeed, parseForms(forms));
    }

    private static Set<PokemonType> parseTypes(List<String> values) {
        if (values == null || values.isEmpty()) {
            return Set.of();
        }
        if (values.size() > MAX_TYPES) {
            throw invalid("type can be given at most " + MAX_TYPES + " times");
        }
        Set<PokemonType> types = new LinkedHashSet<>();
        for (String value : values) {
            PokemonType type = PokemonType.fromIdentifier(value)
                    .orElseThrow(() -> invalid("unknown type '" + value + "'"));
            if (!types.add(type)) {
                throw invalid("type '" + value + "' is repeated");
            }
        }
        return Set.copyOf(types);
    }

    private static Set<FormCategory> parseForms(List<String> values) {
        if (values == null || values.isEmpty()) {
            return FormCategory.SHOWN_BY_DEFAULT;
        }
        Set<FormCategory> forms = EnumSet.noneOf(FormCategory.class);
        for (String value : values) {
            forms.add(FormCategory.fromName(value).orElseThrow(() -> invalid("unknown form '" + value + "'")));
        }
        return Set.copyOf(forms);
    }

    private static void requireRange(String name, Integer value, int min, int max) {
        if (value != null && (value < min || value > max)) {
            throw invalid(name + " must be between " + min + " and " + max);
        }
    }

    private static ApiException invalid(String detail) {
        return new ApiException(ErrorCode.INVALID_PARAMETER, detail);
    }
}
