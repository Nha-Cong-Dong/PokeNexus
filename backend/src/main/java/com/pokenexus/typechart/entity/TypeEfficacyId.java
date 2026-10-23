package com.pokenexus.typechart.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@EqualsAndHashCode
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class TypeEfficacyId implements Serializable {

    @Column(name = "attacking_type_id", columnDefinition = "tinyint unsigned")
    private Integer attackingTypeId;

    @Column(name = "defending_type_id", columnDefinition = "tinyint unsigned")
    private Integer defendingTypeId;
}
