package com.pokenexus.pokedex.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pokenexus.common.web.PageRequestFactory;
import com.pokenexus.common.web.PageResponse;
import com.pokenexus.pokedex.dto.CompareResponse;
import com.pokenexus.pokedex.dto.EvolutionResponse;
import com.pokenexus.pokedex.dto.PokemonDetail;
import com.pokenexus.pokedex.dto.PokemonFilter;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.pokedex.dto.PokemonSummary;
import com.pokenexus.pokedex.dto.SpeedTier;
import com.pokenexus.pokedex.service.CompareService;
import com.pokenexus.pokedex.service.EvolutionService;
import com.pokenexus.pokedex.service.PokemonQueryService;
import com.pokenexus.pokedex.service.SpeedTierService;

@RestController
@RequestMapping("/api/v1/pokemon")
@Tag(name = "Pokédex")
public class PokemonController {

    public static final String CACHE_ONE_HOUR = "public, max-age=3600";

    private final PokemonQueryService pokemonQueryService;
    private final CompareService compareService;
    private final EvolutionService evolutionService;
    private final SpeedTierService speedTierService;

    public PokemonController(PokemonQueryService pokemonQueryService, CompareService compareService,
                             EvolutionService evolutionService, SpeedTierService speedTierService) {
        this.pokemonQueryService = pokemonQueryService;
        this.compareService = compareService;
        this.evolutionService = evolutionService;
        this.speedTierService = speedTierService;
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

    @GetMapping("/search")
    @Operation(summary = "Name suggestions: prefix matches first, then names containing the query")
    public List<PokemonRef> search(
            @Parameter(description = "2-30 characters after trimming, case-insensitive")
            @RequestParam String q,
            @Parameter(description = "1-10, defaults to 10")
            @RequestParam(required = false) Integer limit,
            @Parameter(description = "DEFAULT, REGIONAL, MEGA, GMAX, OTHER; defaults to DEFAULT and REGIONAL")
            @RequestParam(name = "form", required = false) List<String> forms) {
        return pokemonQueryService.searchByName(q, limit, forms);
    }

    @GetMapping("/compare")
    @Operation(summary = "Compare two Pokémon: type advantage, stat total and speed")
    public CompareResponse compare(
            @Parameter(description = "Numeric id or name") @RequestParam String left,
            @Parameter(description = "Numeric id or name, different from left") @RequestParam String right) {
        return compareService.compare(left, right);
    }

    @GetMapping("/speed-tiers")
    @Operation(summary = "Default and regional forms grouped by base Speed, fastest first")
    public ResponseEntity<List<SpeedTier>> speedTiers() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, CACHE_ONE_HOUR)
                .body(speedTierService.findTiers());
    }

    @GetMapping("/{idOrName}")
    @Operation(summary = "Pokémon detail with the 18-type defense grid and all forms of the species")
    public ResponseEntity<PokemonDetail> detail(@PathVariable String idOrName) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, CACHE_ONE_HOUR)
                .body(pokemonQueryService.findDetail(idOrName));
    }

    @GetMapping("/{idOrName}/evolution")
    @Operation(summary = "Evolution chain of the Pokémon species as a flat list ordered by species id")
    public EvolutionResponse evolution(@PathVariable String idOrName) {
        return evolutionService.findChain(idOrName);
    }
}
