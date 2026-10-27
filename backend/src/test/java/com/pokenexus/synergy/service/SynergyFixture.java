package com.pokenexus.synergy.service;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.pokedex.dto.PokemonCatalogEntry;
import com.pokenexus.pokedex.dto.Stats;
import com.pokenexus.pokedex.service.PokemonQueryService;
import com.pokenexus.typechart.service.TypeChartFixture;
import com.pokenexus.typechart.service.TypeChartService;

final class SynergyFixture {

    static final int CHARIZARD = 6;
    static final int GYARADOS = 130;
    static final int DRAGONITE = 149;
    static final int TALONFLAME = 663;
    static final int VOLCARONA = 637;
    static final int EXCADRILL = 530;
    static final List<Integer> EXAMPLE_TEAM = List.of(CHARIZARD, GYARADOS, DRAGONITE, TALONFLAME, VOLCARONA);
    static final List<Integer> EXAMPLE_TEAM_WITH_SIXTH =
            List.of(CHARIZARD, GYARADOS, DRAGONITE, TALONFLAME, VOLCARONA, EXCADRILL);

    static final List<PokemonCatalogEntry> CATALOG = List.of(
            entry(4, "charmander", List.of(PokemonType.FIRE), FormCategory.DEFAULT, false,
                    new Stats(39, 52, 43, 60, 50, 65)),
            entry(6, "charizard", List.of(PokemonType.FIRE, PokemonType.FLYING), FormCategory.DEFAULT, true,
                    new Stats(78, 84, 78, 109, 85, 100)),
            entry(26, "raichu", List.of(PokemonType.ELECTRIC), FormCategory.DEFAULT, true,
                    new Stats(60, 90, 55, 90, 80, 110)),
            entry(130, "gyarados", List.of(PokemonType.WATER, PokemonType.FLYING), FormCategory.DEFAULT, true,
                    new Stats(95, 125, 79, 60, 100, 81)),
            entry(134, "vaporeon", List.of(PokemonType.WATER), FormCategory.DEFAULT, true,
                    new Stats(130, 65, 60, 110, 95, 65)),
            entry(135, "jolteon", List.of(PokemonType.ELECTRIC), FormCategory.DEFAULT, true,
                    new Stats(65, 65, 60, 110, 95, 130)),
            entry(149, "dragonite", List.of(PokemonType.DRAGON, PokemonType.FLYING), FormCategory.DEFAULT, true,
                    new Stats(91, 134, 95, 100, 100, 80)),
            legendary(150, "mewtwo", false, new Stats(106, 110, 90, 154, 90, 130)),
            legendary(151, "mew", true, new Stats(100, 100, 100, 100, 100, 100)),
            entry(248, "tyranitar", List.of(PokemonType.ROCK, PokemonType.DARK), FormCategory.DEFAULT, true,
                    new Stats(100, 134, 110, 95, 100, 61)),
            entry(260, "swampert", List.of(PokemonType.WATER, PokemonType.GROUND), FormCategory.DEFAULT, true,
                    new Stats(100, 110, 90, 85, 90, 60)),
            entry(330, "flygon", List.of(PokemonType.GROUND, PokemonType.DRAGON), FormCategory.DEFAULT, true,
                    new Stats(80, 100, 80, 80, 80, 100)),
            entry(373, "salamence", List.of(PokemonType.DRAGON, PokemonType.FLYING), FormCategory.DEFAULT, true,
                    new Stats(95, 135, 80, 110, 80, 100)),
            entry(376, "metagross", List.of(PokemonType.STEEL, PokemonType.PSYCHIC), FormCategory.DEFAULT, true,
                    new Stats(80, 135, 130, 95, 90, 70)),
            entry(445, "garchomp", List.of(PokemonType.DRAGON, PokemonType.GROUND), FormCategory.DEFAULT, true,
                    new Stats(108, 130, 95, 80, 85, 102)),
            entry(530, "excadrill", List.of(PokemonType.GROUND, PokemonType.STEEL), FormCategory.DEFAULT, true,
                    new Stats(110, 135, 60, 50, 65, 88)),
            entry(637, "volcarona", List.of(PokemonType.BUG, PokemonType.FIRE), FormCategory.DEFAULT, true,
                    new Stats(85, 60, 65, 135, 105, 100)),
            entry(663, "talonflame", List.of(PokemonType.FIRE, PokemonType.FLYING), FormCategory.DEFAULT, true,
                    new Stats(78, 81, 71, 74, 69, 126)),
            entry(10034, "charizard-mega-x", List.of(PokemonType.FIRE, PokemonType.DRAGON), FormCategory.MEGA, true,
                    new Stats(78, 130, 111, 130, 85, 100)),
            entry(10058, "garchomp-mega", List.of(PokemonType.DRAGON, PokemonType.GROUND), FormCategory.MEGA, true,
                    new Stats(108, 170, 115, 120, 95, 92)),
            entry(10104, "ninetales-alola", List.of(PokemonType.ICE, PokemonType.FAIRY), FormCategory.REGIONAL, true,
                    new Stats(73, 67, 75, 81, 100, 109)));

    private SynergyFixture() {
    }

    static TypeChartService typeChart() {
        return TypeChartFixture.loadedService();
    }

    static PokemonProfileRegistry registry(TypeChartService typeChart) {
        PokemonQueryService pokemonQueryService = mock(PokemonQueryService.class);
        when(pokemonQueryService.findAllCatalogEntries()).thenReturn(CATALOG);
        PokemonProfileRegistry registry = new PokemonProfileRegistry(pokemonQueryService, typeChart);
        registry.reload();
        return registry;
    }

    static SynergyAnalyzer analyzer() {
        TypeChartService typeChart = typeChart();
        return new SynergyAnalyzer(registry(typeChart), typeChart);
    }

    private static PokemonCatalogEntry entry(int id, String name, List<PokemonType> types, FormCategory form,
                                             boolean fullyEvolved, Stats stats) {
        return new PokemonCatalogEntry(id, name, types, form, false, false, fullyEvolved, stats, total(stats));
    }

    private static PokemonCatalogEntry legendary(int id, String name, boolean mythical, Stats stats) {
        return new PokemonCatalogEntry(id, name, List.of(PokemonType.PSYCHIC), FormCategory.DEFAULT, !mythical,
                mythical, true, stats, total(stats));
    }

    private static int total(Stats stats) {
        return stats.hp() + stats.attack() + stats.defense() + stats.specialAttack() + stats.specialDefense()
                + stats.speed();
    }
}
