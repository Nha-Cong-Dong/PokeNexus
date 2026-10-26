package com.pokenexus.typechart.service;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.common.web.StaticDataCache;
import com.pokenexus.typechart.dto.DefenseEntry;
import com.pokenexus.typechart.dto.TypeMatrixResponse;
import com.pokenexus.typechart.dto.TypeResponse;
import com.pokenexus.typechart.entity.TypeEfficacy;
import com.pokenexus.typechart.repository.TypeEfficacyRepository;

@Service
public class TypeChartService implements StaticDataCache {

    public static final int MATRIX_SIZE = PokemonType.COUNT * PokemonType.COUNT;

    private static final Logger log = LoggerFactory.getLogger(TypeChartService.class);
    private static final double DAMAGE_FACTOR_SCALE = 100.0;
    private static final List<PokemonType> TYPES = List.of(PokemonType.values());

    private final TypeEfficacyRepository typeEfficacyRepository;

    private volatile double[][] multipliers;

    public TypeChartService(TypeEfficacyRepository typeEfficacyRepository) {
        this.typeEfficacyRepository = typeEfficacyRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void loadOnStartup() {
        try {
            reload();
        } catch (RuntimeException ex) {
            log.warn("Type chart could not be loaded at startup, will retry on demand: {}", ex.getMessage());
        }
    }

    @Override
    public boolean isLoaded() {
        return multipliers != null;
    }

    @Override
    @Transactional(readOnly = true)
    public synchronized boolean reload() {
        long start = System.nanoTime();
        List<TypeEfficacy> rows = typeEfficacyRepository.findAll();
        if (rows.size() != MATRIX_SIZE) {
            log.info("Type chart not loaded: type_efficacy has {} of {} rows", rows.size(), MATRIX_SIZE);
            return isLoaded();
        }
        double[][] matrix = new double[PokemonType.COUNT][PokemonType.COUNT];
        for (TypeEfficacy row : rows) {
            matrix[indexOf(row.getId().getAttackingTypeId())][indexOf(row.getId().getDefendingTypeId())] =
                    row.getDamageFactor() / DAMAGE_FACTOR_SCALE;
        }
        multipliers = matrix;
        log.info("Type chart loaded in {} ms: {} multipliers", (System.nanoTime() - start) / 1_000_000, rows.size());
        return true;
    }

    public double multiplier(PokemonType attacking, PokemonType defending) {
        return table()[attacking.index()][defending.index()];
    }

    public double multiplier(PokemonType attacking, Collection<PokemonType> defendingTypes) {
        double[][] table = table();
        double product = 1.0;
        for (PokemonType defending : defendingTypes) {
            product *= table[attacking.index()][defending.index()];
        }
        return product;
    }

    public double[] defenseMultipliers(Collection<PokemonType> defendingTypes) {
        double[] result = new double[PokemonType.COUNT];
        for (PokemonType attacking : TYPES) {
            result[attacking.index()] = multiplier(attacking, defendingTypes);
        }
        return result;
    }

    public List<DefenseEntry> defenseOf(Collection<PokemonType> defendingTypes) {
        double[] values = defenseMultipliers(defendingTypes);
        return TYPES.stream()
                .map(attacking -> new DefenseEntry(attacking.identifier(), values[attacking.index()]))
                .toList();
    }

    public List<TypeResponse> types() {
        return TYPES.stream().map(TypeResponse::from).toList();
    }

    public TypeMatrixResponse matrix() {
        double[][] table = table();
        List<List<Double>> rows = Arrays.stream(table)
                .map(row -> Arrays.stream(row).boxed().toList())
                .toList();
        return new TypeMatrixResponse(TYPES.stream().map(PokemonType::identifier).toList(), rows);
    }

    private double[][] table() {
        double[][] current = multipliers;
        if (current == null) {
            reload();
            current = multipliers;
        }
        if (current == null) {
            throw new ApiException(ErrorCode.DATA_NOT_READY, "Type chart data has not been loaded yet");
        }
        return current;
    }

    private static int indexOf(Integer typeId) {
        return PokemonType.fromId(typeId)
                .orElseThrow(() -> new IllegalStateException("type_efficacy references unknown type id " + typeId))
                .index();
    }
}
