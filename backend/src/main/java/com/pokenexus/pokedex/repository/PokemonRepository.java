package com.pokenexus.pokedex.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.pokedex.entity.Pokemon;

public interface PokemonRepository extends JpaRepository<Pokemon, Integer>, JpaSpecificationExecutor<Pokemon> {

    @Override
    @EntityGraph(attributePaths = "species")
    Page<Pokemon> findAll(Specification<Pokemon> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"species", "species.generation"})
    Optional<Pokemon> findWithSpeciesById(Integer id);

    @EntityGraph(attributePaths = {"species", "species.generation"})
    Optional<Pokemon> findWithSpeciesByName(String name);

    List<Pokemon> findBySpeciesIdOrderByIdAsc(Integer speciesId);

    List<Pokemon> findBySpeciesIdInAndDefaultFormTrue(Collection<Integer> speciesIds);

    List<Pokemon> findByIdIn(Collection<Integer> ids);

    List<Pokemon> findByFormCategoryIn(Collection<FormCategory> formCategories);

    @Query("SELECT p FROM Pokemon p JOIN FETCH p.species ORDER BY p.id")
    List<Pokemon> findAllWithSpecies();

    @Query("""
            SELECT p FROM Pokemon p
            WHERE p.name LIKE :contains AND p.formCategory IN :forms
            ORDER BY CASE WHEN p.name LIKE :prefix THEN 0 ELSE 1 END, p.id
            """)
    List<Pokemon> searchByName(String contains, String prefix, Collection<FormCategory> forms, Pageable pageable);
}
