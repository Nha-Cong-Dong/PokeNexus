package com.pokenexus.typechart.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import org.hibernate.annotations.Immutable;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "type_efficacy")
@Immutable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class TypeEfficacy {

    @EmbeddedId
    private TypeEfficacyId id;

    @Column(name = "damage_factor", nullable = false, columnDefinition = "tinyint unsigned")
    private Integer damageFactor;
}
