package com.pokenexus.pokedex.mapper;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import org.springframework.stereotype.Component;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.pokedex.dto.PokemonCatalogEntry;
import com.pokenexus.pokedex.dto.PokemonDetail;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.pokedex.dto.PokemonSummary;
import com.pokenexus.pokedex.dto.Stats;
import com.pokenexus.pokedex.entity.Pokemon;
import com.pokenexus.pokedex.entity.Species;
import com.pokenexus.typechart.dto.DefenseEntry;

@Component
public class PokemonMapper {

    public PokemonSummary toSummary(Pokemon pokemon) {
        return new PokemonSummary(
                pokemon.getId(),
                pokemon.getName(),
                typeNames(pokemon),
                pokemon.getSpecies().getGeneration().getId(),
                pokemon.getFormCategory(),
                pokemon.getBaseStatTotal(),
                pokemon.getSpeed());
    }

    public PokemonRef toRef(Pokemon pokemon) {
        return new PokemonRef(pokemon.getId(), pokemon.getName(), typeNames(pokemon));
    }

    public PokemonDetail toDetail(Pokemon pokemon, List<DefenseEntry> defense, List<Pokemon> forms) {
        Species species = pokemon.getSpecies();
        return new PokemonDetail(
                pokemon.getId(),
                pokemon.getName(),
                typeNames(pokemon),
                species.getId(),
                species.getName(),
                species.getGeneration().getId(),
                pokemon.getFormCategory(),
                species.isLegendary(),
                species.isMythical(),
                species.isFullyEvolved(),
                toStats(pokemon),
                pokemon.getBaseStatTotal(),
                pokemon.getHeightDm(),
                pokemon.getWeightHg(),
                defense,
                forms.stream()
                        .map(form -> new PokemonDetail.Form(form.getId(), form.getName(), form.getFormCategory()))
                        .toList());
    }

    public PokemonCatalogEntry toCatalogEntry(Pokemon pokemon) {
        Species species = pokemon.getSpecies();
        return new PokemonCatalogEntry(
                pokemon.getId(),
                pokemon.getName(),
                typesOf(pokemon),
                pokemon.getFormCategory(),
                species.isLegendary(),
                species.isMythical(),
                species.isFullyEvolved(),
                toStats(pokemon),
                pokemon.getBaseStatTotal());
    }

    public Stats toStats(Pokemon pokemon) {
        return new Stats(
                pokemon.getHp(),
                pokemon.getAttack(),
                pokemon.getDefense(),
                pokemon.getSpecialAttack(),
                pokemon.getSpecialDefense(),
                pokemon.getSpeed());
    }

    public List<PokemonType> typesOf(Pokemon pokemon) {
        return Stream.of(pokemon.getPrimaryType(), pokemon.getSecondaryType())
                .filter(Objects::nonNull)
                .toList();
    }

    private List<String> typeNames(Pokemon pokemon) {
        return typesOf(pokemon).stream().map(PokemonType::identifier).toList();
    }
}
