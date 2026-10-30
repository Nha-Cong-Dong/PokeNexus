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
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.pokedex.dto.SpeedTier;
import com.pokenexus.pokedex.mapper.PokemonMapper;
import com.pokenexus.pokedex.repository.PokemonRepository;
import com.pokenexus.pokedex.service.SpeedTierService.SpeedEntry;

class SpeedTierServiceTest {

    private static final PokemonRef GARCHOMP = new PokemonRef(445, "garchomp", List.of("dragon", "ground"));
    private static final PokemonRef CHARIZARD = new PokemonRef(6, "charizard", List.of("fire", "flying"));
    private static final PokemonRef SALAMENCE = new PokemonRef(373, "salamence", List.of("dragon", "flying"));
    private static final PokemonRef SNORLAX = new PokemonRef(143, "snorlax", List.of("normal"));

    @Test
    void groupsEqualSpeedsFastestFirstWithIdsAscending() {
        List<SpeedTier> tiers = SpeedTierService.group(List.of(
                new SpeedEntry(100, SALAMENCE),
                new SpeedEntry(30, SNORLAX),
                new SpeedEntry(102, GARCHOMP),
                new SpeedEntry(100, CHARIZARD)));

        assertThat(tiers).containsExactly(
                new SpeedTier(102, List.of(GARCHOMP)),
                new SpeedTier(100, List.of(CHARIZARD, SALAMENCE)),
                new SpeedTier(30, List.of(SNORLAX)));
    }

    @Test
    void returnsNoTiersForNoEntries() {
        assertThat(SpeedTierService.group(List.of())).isEmpty();
    }

    @Test
    void reportsDataNotReadyWhenThePokemonTableIsEmpty() {
        PokemonRepository repository = mock(PokemonRepository.class);
        when(repository.findByFormCategoryIn(any())).thenReturn(List.of());
        SpeedTierService service = new SpeedTierService(repository, new PokemonMapper());

        assertThatThrownBy(service::findTiers)
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.errorCode()).isEqualTo(ErrorCode.DATA_NOT_READY));
    }
}
