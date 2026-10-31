package com.pokenexus.pokedex.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.pokedex.dto.GenerationProfile;
import com.pokenexus.pokedex.dto.GenerationProfile.TypeCount;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.pokedex.mapper.PokemonMapper;
import com.pokenexus.pokedex.repository.PokemonRepository;
import com.pokenexus.pokedex.service.GenerationProfileService.GenerationEntry;

class GenerationProfileServiceTest {

    private static final GenerationEntry CHARIZARD = entry(1, 6, "charizard", List.of("fire", "flying"), 534);
    private static final GenerationEntry VAPOREON = entry(1, 134, "vaporeon", List.of("water"), 525);
    private static final GenerationEntry FLAREON = entry(1, 136, "flareon", List.of("fire"), 525);
    private static final GenerationEntry MEWTWO =
            new GenerationEntry(1, new PokemonRef(150, "mewtwo", List.of("psychic")), 680, true, false);
    private static final GenerationEntry MEW =
            new GenerationEntry(1, new PokemonRef(151, "mew", List.of("psychic")), 600, false, true);
    private static final GenerationEntry GARCHOMP = entry(4, 445, "garchomp", List.of("dragon", "ground"), 600);

    @Test
    void summarizesEachGenerationInOrder() {
        List<GenerationProfile> profiles = GenerationProfileService.summarize(
                List.of(GARCHOMP, MEWTWO, VAPOREON, CHARIZARD, MEW, FLAREON));

        assertThat(profiles).extracting(GenerationProfile::generation).containsExactly(1, 4);
        GenerationProfile kanto = profiles.getFirst();
        assertThat(kanto.speciesCount()).isEqualTo(5);
        assertThat(kanto.legendaryCount()).isEqualTo(1);
        assertThat(kanto.mythicalCount()).isEqualTo(1);
        assertThat(kanto.averageBaseStatTotal()).isEqualTo(572.8);
        assertThat(kanto.topTypes()).containsExactly(
                new TypeCount("fire", 2), new TypeCount("psychic", 2), new TypeCount("flying", 1));
        assertThat(kanto.strongest().name()).isEqualTo("charizard");
        assertThat(kanto.strongestBaseStatTotal()).isEqualTo(534);
    }

    @Test
    void breaksStrongestTiesByTheSmallerIdAndFallsBackToLegendaries() {
        List<GenerationProfile> tie = GenerationProfileService.summarize(List.of(FLAREON, VAPOREON));
        List<GenerationProfile> onlyLegends = GenerationProfileService.summarize(List.of(MEW, MEWTWO));

        assertThat(tie.getFirst().strongest().name()).isEqualTo("vaporeon");
        assertThat(onlyLegends.getFirst().strongest().name()).isEqualTo("mewtwo");
    }

    @Test
    void returnsNoProfileForNoEntries() {
        assertThat(GenerationProfileService.summarize(List.of())).isEmpty();
    }

    @Test
    void reportsDataNotReadyWhenThePokemonTableIsEmpty() {
        PokemonRepository repository = mock(PokemonRepository.class);
        when(repository.findWithSpeciesByFormCategory(any())).thenReturn(List.of());
        GenerationProfileService service = new GenerationProfileService(repository, new PokemonMapper());

        assertThatThrownBy(service::findProfiles)
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.errorCode()).isEqualTo(ErrorCode.DATA_NOT_READY));
    }

    private static GenerationEntry entry(int generation, int id, String name, List<String> types, int total) {
        return new GenerationEntry(generation, new PokemonRef(id, name, types), total, false, false);
    }
}
