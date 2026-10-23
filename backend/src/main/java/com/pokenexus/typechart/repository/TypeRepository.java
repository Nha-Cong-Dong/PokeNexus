package com.pokenexus.typechart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pokenexus.typechart.entity.Type;

public interface TypeRepository extends JpaRepository<Type, Integer> {
}
