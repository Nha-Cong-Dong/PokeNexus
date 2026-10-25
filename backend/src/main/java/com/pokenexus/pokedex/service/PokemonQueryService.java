package com.pokenexus.pokedex.service;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.common.web.PageResponse;
import com.pokenexus.pokedex.dto.PokemonFilter;
import com.pokenexus.pokedex.dto.PokemonSummary;
import com.pokenexus.pokedex.entity.Pokemon;
import com.pokenexus.pokedex.mapper.PokemonMapper;
import com.pokenexus.pokedex.repository.PokemonRepository;
import com.pokenexus.pokedex.repository.PokemonSpecifications;

@Service
public class PokemonQueryService {

    public static final Set<String> SORTABLE_PROPERTIES = Set.of("id", "name", "baseStatTotal", "speed");

    private final PokemonRepository pokemonRepository;
    private final PokemonMapper pokemonMapper;

    public PokemonQueryService(PokemonRepository pokemonRepository, PokemonMapper pokemonMapper) {
        this.pokemonRepository = pokemonRepository;
        this.pokemonMapper = pokemonMapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<PokemonSummary> search(PokemonFilter filter, Pageable pageable) {
        Page<Pokemon> page = pokemonRepository.findAll(PokemonSpecifications.matching(filter), pageable);
        if (page.getTotalElements() == 0 && pokemonRepository.count() == 0) {
            throw new ApiException(ErrorCode.DATA_NOT_READY, "Pokémon data has not been loaded yet");
        }
        return PageResponse.from(page, pokemonMapper::toSummary);
    }
}
