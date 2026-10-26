package com.pokenexus.synergy.service;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.common.web.StaticDataCache;
import com.pokenexus.pokedex.dto.PokemonCatalogEntry;
import com.pokenexus.pokedex.service.PokemonQueryService;
import com.pokenexus.synergy.model.PokemonProfile;
import com.pokenexus.typechart.service.TypeChartService;

@Service
public class PokemonProfileRegistry implements StaticDataCache {

    private static final Logger log = LoggerFactory.getLogger(PokemonProfileRegistry.class);

    private final PokemonQueryService pokemonQueryService;
    private final TypeChartService typeChartService;

    private volatile Snapshot snapshot;

    public PokemonProfileRegistry(PokemonQueryService pokemonQueryService, TypeChartService typeChartService) {
        this.pokemonQueryService = pokemonQueryService;
        this.typeChartService = typeChartService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void loadOnStartup() {
        try {
            reload();
        } catch (RuntimeException ex) {
            log.warn("Pokémon profiles could not be loaded at startup, will retry on demand: {}", ex.getMessage());
        }
    }

    @Override
    public boolean isLoaded() {
        return snapshot != null;
    }

    @Override
    public synchronized boolean reload() {
        long start = System.nanoTime();
        if (!typeChartService.isLoaded() && !typeChartService.reload()) {
            log.info("Pokémon profiles not loaded: type chart is not available yet");
            return isLoaded();
        }
        List<PokemonCatalogEntry> entries = pokemonQueryService.findAllCatalogEntries();
        if (entries.isEmpty()) {
            log.info("Pokémon profiles not loaded: table pokemon is empty");
            return isLoaded();
        }
        List<PokemonProfile> profiles = entries.stream()
                .map(entry -> new PokemonProfile(entry, typeChartService.defenseMultipliers(entry.types())))
                .sorted(Comparator.comparingInt(PokemonProfile::id))
                .toList();
        Map<Integer, PokemonProfile> byId = new LinkedHashMap<>();
        profiles.forEach(profile -> byId.put(profile.id(), profile));
        snapshot = new Snapshot(Map.copyOf(byId), profiles);
        log.info("Pokémon profiles loaded in {} ms: {} profiles", (System.nanoTime() - start) / 1_000_000,
                profiles.size());
        return true;
    }

    public Optional<PokemonProfile> find(int id) {
        return Optional.ofNullable(current().byId().get(id));
    }

    public List<PokemonProfile> all() {
        return current().all();
    }

    private Snapshot current() {
        Snapshot current = snapshot;
        if (current == null) {
            reload();
            current = snapshot;
        }
        if (current == null) {
            throw new ApiException(ErrorCode.DATA_NOT_READY, "Pokémon data has not been loaded yet");
        }
        return current;
    }

    private record Snapshot(Map<Integer, PokemonProfile> byId, List<PokemonProfile> all) {
    }
}
