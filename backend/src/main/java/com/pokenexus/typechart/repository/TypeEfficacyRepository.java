package com.pokenexus.typechart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pokenexus.typechart.entity.TypeEfficacy;
import com.pokenexus.typechart.entity.TypeEfficacyId;

public interface TypeEfficacyRepository extends JpaRepository<TypeEfficacy, TypeEfficacyId> {
}
