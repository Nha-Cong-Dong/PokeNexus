package com.pokenexus.pokedex.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.Immutable;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "evolution_links")
@Immutable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EvolutionLink {

    @Id
    @Column(columnDefinition = "int unsigned")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chain_id")
    private EvolutionChain chain;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "from_species_id")
    private Species fromSpecies;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "to_species_id")
    private Species toSpecies;

    @Column(name = "trigger_name", nullable = false, length = 30)
    private String triggerName;

    @Column(name = "min_level", columnDefinition = "tinyint unsigned")
    private Integer minLevel;

    @Column(name = "item_name", length = 50)
    private String itemName;
}
