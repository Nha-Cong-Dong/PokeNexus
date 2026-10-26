package com.pokenexus.pokedex.service;

import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.common.exception.NotFoundException;
import com.pokenexus.common.web.PageResponse;
import com.pokenexus.pokedex.dto.PokemonCatalogEntry;
import com.pokenexus.pokedex.dto.PokemonDetail;
import com.pokenexus.pokedex.dto.PokemonFilter;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.pokedex.dto.PokemonSummary;
import com.pokenexus.pokedex.entity.Pokemon;
import com.pokenexus.pokedex.mapper.PokemonMapper;
import com.pokenexus.pokedex.repository.PokemonRepository;
import com.pokenexus.pokedex.repository.PokemonSpecifications;
import com.pokenexus.typechart.service.TypeChartService;

@Service
public class PokemonQueryService {

    public static final Set<String> SORTABLE_PROPERTIES = Set.of("id", "name", "baseStatTotal", "speed");
    public static final int MIN_QUERY_LENGTH = 2;
    public static final int MAX_QUERY_LENGTH = 30;
    public static final int DEFAULT_SEARCH_LIMIT = 10;
    public static final int MAX_SEARCH_LIMIT = 10;

    private static final Pattern NUMERIC_ID = Pattern.compile("\\d+");
    private static final Pattern POKEMON_NAME = Pattern.compile("[a-z0-9-]{1,60}");
    private static final Pattern SEARCHABLE = Pattern.compile("[a-z0-9-]+");
    private static final Pattern WHITESPACE = Pattern.compile("\\s+");
    private static final int MAX_ID_DIGITS = 9;

    private final PokemonRepository pokemonRepository;
    private final PokemonMapper pokemonMapper;
    private final TypeChartService typeChartService;

    public PokemonQueryService(PokemonRepository pokemonRepository, PokemonMapper pokemonMapper,
                               TypeChartService typeChartService) {
        this.pokemonRepository = pokemonRepository;
        this.pokemonMapper = pokemonMapper;
        this.typeChartService = typeChartService;
    }

    @Transactional(readOnly = true)
    public PageResponse<PokemonSummary> search(PokemonFilter filter, Pageable pageable) {
        Page<Pokemon> page = pokemonRepository.findAll(PokemonSpecifications.matching(filter), pageable);
        if (page.getTotalElements() == 0) {
            requireData();
        }
        return PageResponse.from(page, pokemonMapper::toSummary);
    }

    @Transactional(readOnly = true)
    public PokemonDetail findDetail(String idOrName) {
        Pokemon pokemon = findPokemon(idOrName);
        List<Pokemon> forms = pokemonRepository.findBySpeciesIdOrderByIdAsc(pokemon.getSpecies().getId());
        return pokemonMapper.toDetail(pokemon, typeChartService.defenseOf(pokemonMapper.typesOf(pokemon)), forms);
    }

    @Transactional(readOnly = true)
    public Pokemon findPokemon(String idOrName) {
        Optional<Pokemon> pokemon = lookup(idOrName);
        if (pokemon.isEmpty()) {
            requireData();
            throw new NotFoundException(ErrorCode.POKEMON_NOT_FOUND, "Pokémon '" + idOrName + "' not found");
        }
        return pokemon.get();
    }

    @Transactional(readOnly = true)
    public List<PokemonRef> searchByName(String query, Integer limit, List<String> forms) {
        String trimmed = query == null ? "" : query.strip();
        if (trimmed.length() < MIN_QUERY_LENGTH || trimmed.length() > MAX_QUERY_LENGTH) {
            throw invalid("q must be between " + MIN_QUERY_LENGTH + " and " + MAX_QUERY_LENGTH
                    + " characters after trimming");
        }
        int maxResults = limit == null ? DEFAULT_SEARCH_LIMIT : limit;
        if (maxResults < 1 || maxResults > MAX_SEARCH_LIMIT) {
            throw invalid("limit must be between 1 and " + MAX_SEARCH_LIMIT);
        }
        Set<FormCategory> formCategories = PokemonFilter.parseForms(forms);
        String normalized = WHITESPACE.matcher(trimmed.toLowerCase(Locale.ROOT)).replaceAll("-");
        if (!SEARCHABLE.matcher(normalized).matches()) {
            return List.of();
        }
        List<Pokemon> matches = pokemonRepository.searchByName(
                "%" + normalized + "%", normalized + "%", formCategories, PageRequest.of(0, maxResults));
        if (matches.isEmpty()) {
            requireData();
        }
        return matches.stream().map(pokemonMapper::toRef).toList();
    }

    @Transactional(readOnly = true)
    public Map<Integer, PokemonRef> findRefs(Collection<Integer> ids) {
        if (ids.isEmpty()) {
            return Map.of();
        }
        return pokemonRepository.findByIdIn(ids).stream()
                .map(pokemonMapper::toRef)
                .collect(Collectors.toUnmodifiableMap(PokemonRef::id, Function.identity()));
    }

    @Transactional(readOnly = true)
    public List<PokemonCatalogEntry> findAllCatalogEntries() {
        return pokemonRepository.findAllWithSpecies().stream().map(pokemonMapper::toCatalogEntry).toList();
    }

    private Optional<Pokemon> lookup(String idOrName) {
        if (idOrName != null && NUMERIC_ID.matcher(idOrName).matches()) {
            if (idOrName.length() > MAX_ID_DIGITS) {
                return Optional.empty();
            }
            return pokemonRepository.findWithSpeciesById(Integer.parseInt(idOrName));
        }
        if (idOrName == null || !POKEMON_NAME.matcher(idOrName).matches()) {
            throw invalid("idOrName must be a numeric id or a name matching ^[a-z0-9-]{1,60}$");
        }
        return pokemonRepository.findWithSpeciesByName(idOrName);
    }

    private void requireData() {
        if (pokemonRepository.count() == 0) {
            throw new ApiException(ErrorCode.DATA_NOT_READY, "Pokémon data has not been loaded yet");
        }
    }

    private static ApiException invalid(String detail) {
        return new ApiException(ErrorCode.INVALID_PARAMETER, detail);
    }
}
