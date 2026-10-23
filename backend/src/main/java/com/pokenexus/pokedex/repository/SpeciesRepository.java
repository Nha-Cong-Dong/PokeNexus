package com.pokenexus.pokedex.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pokenexus.pokedex.entity.Species;

public interface SpeciesRepository extends JpaRepository<Species, Integer> {
}
