package com.pokenexus.typechart.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.Immutable;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "types")
@Immutable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Type {

    @Id
    @Column(columnDefinition = "tinyint unsigned")
    private Integer id;

    @Column(nullable = false, length = 20)
    private String name;
}
