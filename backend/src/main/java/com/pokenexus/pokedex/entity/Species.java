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
@Table(name = "species")
@Immutable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Species {

    @Id
    @Column(columnDefinition = "smallint unsigned")
    private Integer id;

    @Column(nullable = false, length = 50)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "generation_id")
    private Generation generation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evolution_chain_id")
    private EvolutionChain evolutionChain;

    @Column(name = "is_legendary", nullable = false)
    private boolean legendary;

    @Column(name = "is_mythical", nullable = false)
    private boolean mythical;

    @Column(name = "is_fully_evolved", nullable = false)
    private boolean fullyEvolved;
}
