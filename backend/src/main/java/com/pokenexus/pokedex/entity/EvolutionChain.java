package com.pokenexus.pokedex.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.Immutable;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "evolution_chains")
@Immutable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EvolutionChain {

    @Id
    @Column(columnDefinition = "smallint unsigned")
    private Integer id;
}
