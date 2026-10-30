package com.pokenexus.pokedex.service;

import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.pokedex.dto.SpeedTier;
import com.pokenexus.pokedex.mapper.PokemonMapper;
import com.pokenexus.pokedex.repository.PokemonRepository;

@Service
public class SpeedTierService {

    private static final Set<FormCategory> TIER_FORMS = EnumSet.of(FormCategory.DEFAULT, FormCategory.REGIONAL);

    private final PokemonRepository pokemonRepository;
    private final PokemonMapper pokemonMapper;

    public SpeedTierService(PokemonRepository pokemonRepository, PokemonMapper pokemonMapper) {
        this.pokemonRepository = pokemonRepository;
        this.pokemonMapper = pokemonMapper;
    }

    @Transactional(readOnly = true)
    public List<SpeedTier> findTiers() {
        List<SpeedEntry> entries = pokemonRepository.findByFormCategoryIn(TIER_FORMS).stream()
                .map(pokemon -> new SpeedEntry(pokemon.getSpeed(), pokemonMapper.toRef(pokemon)))
                .toList();
        if (entries.isEmpty()) {
            throw new ApiException(ErrorCode.DATA_NOT_READY, "Pokémon data has not been loaded yet");
        }
        return group(entries);
    }

    static List<SpeedTier> group(List<SpeedEntry> entries) {
        Map<Integer, List<PokemonRef>> bySpeed = entries.stream()
                .sorted(Comparator.comparingInt(entry -> entry.pokemon().id()))
                .collect(Collectors.groupingBy(SpeedEntry::speed, () -> new TreeMap<>(Comparator.reverseOrder()),
                        Collectors.mapping(SpeedEntry::pokemon, Collectors.toList())));
        return bySpeed.entrySet().stream()
                .map(tier -> new SpeedTier(tier.getKey(), List.copyOf(tier.getValue())))
                .toList();
    }

    record SpeedEntry(int speed, PokemonRef pokemon) {
    }
}
