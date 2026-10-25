package com.pokenexus.pokedex.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pokenexus.common.web.PageRequestFactory;
import com.pokenexus.common.web.PageResponse;
import com.pokenexus.pokedex.dto.PokemonFilter;
import com.pokenexus.pokedex.dto.PokemonSummary;
import com.pokenexus.pokedex.service.PokemonQueryService;

@RestController
@RequestMapping("/api/v1/pokemon")
@Tag(name = "Pokédex")
public class PokemonController {

    private final PokemonQueryService pokemonQueryService;

    public PokemonController(PokemonQueryService pokemonQueryService) {
        this.pokemonQueryService = pokemonQueryService;
    }

    @GetMapping
    @Operation(summary = "Omni-Dex: filter, sort and paginate Pokémon")
    public PageResponse<PokemonSummary> list(
            @Parameter(description = "Type name, repeat up to 2 times; Pokémon must have all of them")
            @RequestParam(name = "type", required = false) List<String> types,
            @Parameter(description = "Generation of the species, 1-9")
            @RequestParam(name = "gen", required = false) Integer generation,
            @RequestParam(required = false) Integer minBst,
            @RequestParam(required = false) Integer maxBst,
            @RequestParam(required = false) Integer minSpeed,
            @Parameter(description = "DEFAULT, REGIONAL, MEGA, GMAX, OTHER; defaults to DEFAULT and REGIONAL")
            @RequestParam(name = "form", required = false) List<String> forms,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @Parameter(description = "<property>,<asc|desc> with property in id, name, baseStatTotal, speed")
            @RequestParam(required = false) String sort) {
        PokemonFilter filter = PokemonFilter.of(types, generation, minBst, maxBst, minSpeed, forms);
        return pokemonQueryService.search(filter,
                PageRequestFactory.of(page, size, sort, PokemonQueryService.SORTABLE_PROPERTIES));
    }
}
