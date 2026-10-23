package com.pokenexus.pokedex.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.Immutable;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.common.domain.PokemonTypeConverter;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pokemon")
@Immutable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Pokemon {

    @Id
    @Column(columnDefinition = "smallint unsigned")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "species_id")
    private Species species;

    @Column(nullable = false, length = 60)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "form_category", nullable = false, length = 10)
    private FormCategory formCategory;

    @Column(name = "is_default", nullable = false)
    private boolean defaultForm;

    @Convert(converter = PokemonTypeConverter.class)
    @Column(name = "primary_type_id", nullable = false, columnDefinition = "tinyint unsigned")
    private PokemonType primaryType;

    @Convert(converter = PokemonTypeConverter.class)
    @Column(name = "secondary_type_id", columnDefinition = "tinyint unsigned")
    private PokemonType secondaryType;

    @Column(nullable = false, columnDefinition = "tinyint unsigned")
    private Integer hp;

    @Column(nullable = false, columnDefinition = "tinyint unsigned")
    private Integer attack;

    @Column(nullable = false, columnDefinition = "tinyint unsigned")
    private Integer defense;

    @Column(name = "special_attack", nullable = false, columnDefinition = "tinyint unsigned")
    private Integer specialAttack;

    @Column(name = "special_defense", nullable = false, columnDefinition = "tinyint unsigned")
    private Integer specialDefense;

    @Column(nullable = false, columnDefinition = "tinyint unsigned")
    private Integer speed;

    @Column(name = "base_stat_total", insertable = false, updatable = false, columnDefinition = "smallint unsigned")
    private Integer baseStatTotal;

    @Column(name = "height_dm", nullable = false, columnDefinition = "smallint unsigned")
    private Integer heightDm;

    @Column(name = "weight_hg", nullable = false, columnDefinition = "smallint unsigned")
    private Integer weightHg;
}
