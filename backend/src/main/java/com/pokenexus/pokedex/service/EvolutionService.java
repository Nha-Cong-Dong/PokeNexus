package com.pokenexus.pokedex.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pokenexus.pokedex.dto.EvolutionResponse;
import com.pokenexus.pokedex.dto.EvolutionStage;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.pokedex.entity.EvolutionChain;
import com.pokenexus.pokedex.entity.EvolutionLink;
import com.pokenexus.pokedex.entity.Pokemon;
import com.pokenexus.pokedex.entity.Species;
import com.pokenexus.pokedex.mapper.PokemonMapper;
import com.pokenexus.pokedex.repository.EvolutionLinkRepository;
import com.pokenexus.pokedex.repository.PokemonRepository;
import com.pokenexus.pokedex.repository.SpeciesRepository;

@Service
public class EvolutionService {

    public static final int NO_CHAIN_ID = 0;

    private final PokemonQueryService pokemonQueryService;
    private final SpeciesRepository speciesRepository;
    private final EvolutionLinkRepository evolutionLinkRepository;
    private final PokemonRepository pokemonRepository;
    private final PokemonMapper pokemonMapper;

    public EvolutionService(PokemonQueryService pokemonQueryService, SpeciesRepository speciesRepository,
                            EvolutionLinkRepository evolutionLinkRepository, PokemonRepository pokemonRepository,
                            PokemonMapper pokemonMapper) {
        this.pokemonQueryService = pokemonQueryService;
        this.speciesRepository = speciesRepository;
        this.evolutionLinkRepository = evolutionLinkRepository;
        this.pokemonRepository = pokemonRepository;
        this.pokemonMapper = pokemonMapper;
    }

    @Transactional(readOnly = true)
    public EvolutionResponse findChain(String idOrName) {
        Species species = pokemonQueryService.findPokemon(idOrName).getSpecies();
        EvolutionChain chain = species.getEvolutionChain();
        if (chain == null) {
            return new EvolutionResponse(NO_CHAIN_ID, stagesOf(List.of(species), Map.of()));
        }
        Map<Integer, EvolutionLink> linkByTarget = evolutionLinkRepository.findByChainId(chain.getId()).stream()
                .collect(Collectors.toMap(link -> link.getToSpecies().getId(), Function.identity()));
        return new EvolutionResponse(chain.getId(),
                stagesOf(speciesRepository.findByEvolutionChainIdOrderByIdAsc(chain.getId()), linkByTarget));
    }

    private List<EvolutionStage> stagesOf(List<Species> speciesInChain, Map<Integer, EvolutionLink> linkByTarget) {
        List<Integer> speciesIds = speciesInChain.stream().map(Species::getId).toList();
        Map<Integer, Pokemon> defaultFormBySpecies = pokemonRepository.findBySpeciesIdInAndDefaultFormTrue(speciesIds)
                .stream()
                .collect(Collectors.toMap(pokemon -> pokemon.getSpecies().getId(), Function.identity(),
                        (first, second) -> first.getId() <= second.getId() ? first : second));
        return speciesInChain.stream()
                .sorted(Comparator.comparingInt(Species::getId))
                .flatMap(species -> Optional.ofNullable(defaultFormBySpecies.get(species.getId()))
                        .map(pokemon -> toStage(species, pokemon, linkByTarget.get(species.getId())))
                        .stream())
                .toList();
    }

    private EvolutionStage toStage(Species species, Pokemon pokemon, EvolutionLink link) {
        PokemonRef ref = pokemonMapper.toRef(pokemon);
        if (link == null) {
            return new EvolutionStage(species.getId(), ref.id(), ref.name(), ref.types(), null, null, null, null);
        }
        return new EvolutionStage(species.getId(), ref.id(), ref.name(), ref.types(),
                link.getFromSpecies().getId(), link.getTriggerName(), link.getMinLevel(), link.getItemName());
    }
}
