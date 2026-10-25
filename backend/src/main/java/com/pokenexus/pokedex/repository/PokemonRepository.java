package com.pokenexus.pokedex.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pokenexus.pokedex.entity.Pokemon;

public interface PokemonRepository extends JpaRepository<Pokemon, Integer>, JpaSpecificationExecutor<Pokemon> {

    @Override
    @EntityGraph(attributePaths = "species")
    Page<Pokemon> findAll(Specification<Pokemon> spec, Pageable pageable);
}
