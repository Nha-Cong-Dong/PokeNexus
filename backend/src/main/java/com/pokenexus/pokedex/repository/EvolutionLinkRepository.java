package com.pokenexus.pokedex.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pokenexus.pokedex.entity.EvolutionLink;

public interface EvolutionLinkRepository extends JpaRepository<EvolutionLink, Long> {

    List<EvolutionLink> findByChainId(Integer chainId);
}
