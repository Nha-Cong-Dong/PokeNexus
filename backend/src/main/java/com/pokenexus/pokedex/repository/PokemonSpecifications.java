package com.pokenexus.pokedex.repository;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.pokedex.dto.PokemonFilter;
import com.pokenexus.pokedex.entity.Pokemon;

public final class PokemonSpecifications {

    private PokemonSpecifications() {
    }

    public static Specification<Pokemon> matching(PokemonFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            for (PokemonType type : filter.types()) {
                predicates.add(cb.or(
                        cb.equal(root.get("primaryType"), type),
                        cb.equal(root.get("secondaryType"), type)));
            }
            if (filter.generation() != null) {
                predicates.add(cb.equal(root.get("species").get("generation").get("id"), filter.generation()));
            }
            if (filter.minBst() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("baseStatTotal"), filter.minBst()));
            }
            if (filter.maxBst() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("baseStatTotal"), filter.maxBst()));
            }
            if (filter.minSpeed() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("speed"), filter.minSpeed()));
            }
            predicates.add(root.get("formCategory").in(filter.forms()));
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
