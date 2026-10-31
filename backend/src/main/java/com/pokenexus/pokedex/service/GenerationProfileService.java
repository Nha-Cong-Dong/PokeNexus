package com.pokenexus.pokedex.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.pokedex.dto.GenerationProfile;
import com.pokenexus.pokedex.dto.GenerationProfile.TypeCount;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.pokedex.entity.Pokemon;
import com.pokenexus.pokedex.entity.Species;
import com.pokenexus.pokedex.mapper.PokemonMapper;
import com.pokenexus.pokedex.repository.PokemonRepository;

@Service
public class GenerationProfileService {

    public static final int TOP_TYPE_COUNT = 3;

    private final PokemonRepository pokemonRepository;
    private final PokemonMapper pokemonMapper;

    private volatile List<GenerationProfile> profiles;

    public GenerationProfileService(PokemonRepository pokemonRepository, PokemonMapper pokemonMapper) {
        this.pokemonRepository = pokemonRepository;
        this.pokemonMapper = pokemonMapper;
    }

    @Transactional(readOnly = true)
    public List<GenerationProfile> findProfiles() {
        List<GenerationProfile> cached = profiles;
        if (cached != null) {
            return cached;
        }
        List<GenerationEntry> entries = pokemonRepository.findWithSpeciesByFormCategory(FormCategory.DEFAULT)
                .stream()
                .map(this::toEntry)
                .toList();
        if (entries.isEmpty()) {
            throw new ApiException(ErrorCode.DATA_NOT_READY, "Pokémon data has not been loaded yet");
        }
        List<GenerationProfile> computed = summarize(entries);
        profiles = computed;
        return computed;
    }

    static List<GenerationProfile> summarize(List<GenerationEntry> entries) {
        Map<Integer, List<GenerationEntry>> byGeneration = entries.stream()
                .collect(Collectors.groupingBy(GenerationEntry::generation, TreeMap::new, Collectors.toList()));
        List<GenerationProfile> result = new ArrayList<>();
        byGeneration.forEach((generation, members) -> result.add(profileOf(generation, members)));
        return List.copyOf(result);
    }

    private static GenerationProfile profileOf(int generation, List<GenerationEntry> members) {
        Map<String, Integer> typeCounts = new TreeMap<>();
        members.forEach(member -> member.pokemon().types()
                .forEach(type -> typeCounts.merge(type, 1, Integer::sum)));
        List<TypeCount> topTypes = typeCounts.entrySet().stream()
                .map(entry -> new TypeCount(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparingInt(TypeCount::count).reversed().thenComparing(TypeCount::type))
                .limit(TOP_TYPE_COUNT)
                .toList();
        double average = members.stream().mapToInt(GenerationEntry::baseStatTotal).average().orElse(0);
        GenerationEntry strongest = members.stream()
                .filter(member -> !member.legendary() && !member.mythical())
                .max(Comparator.comparingInt(GenerationEntry::baseStatTotal)
                        .thenComparing(Comparator.comparingInt((GenerationEntry member) -> member.pokemon().id())
                                .reversed()))
                .orElseGet(() -> members.stream()
                        .max(Comparator.comparingInt(GenerationEntry::baseStatTotal))
                        .orElseThrow());
        return new GenerationProfile(
                generation,
                members.size(),
                (int) members.stream().filter(GenerationEntry::legendary).count(),
                (int) members.stream().filter(GenerationEntry::mythical).count(),
                BigDecimal.valueOf(average).setScale(1, RoundingMode.HALF_UP).doubleValue(),
                topTypes,
                strongest.pokemon(),
                strongest.baseStatTotal());
    }

    private GenerationEntry toEntry(Pokemon pokemon) {
        Species species = pokemon.getSpecies();
        return new GenerationEntry(species.getGeneration().getId(), pokemonMapper.toRef(pokemon),
                pokemon.getBaseStatTotal(), species.isLegendary(), species.isMythical());
    }

    record GenerationEntry(int generation, PokemonRef pokemon, int baseStatTotal, boolean legendary,
                           boolean mythical) {
    }
}
