package com.pokenexus.pokedex.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pokenexus.pokedex.entity.Species;

public interface SpeciesRepository extends JpaRepository<Species, Integer> {

    List<Species> findByEvolutionChainIdOrderByIdAsc(Integer evolutionChainId);
}
