package com.pokenexus.team.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pokenexus.team.entity.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {

    @EntityGraph(attributePaths = "members")
    Optional<Team> findByShareCode(String shareCode);

    boolean existsByShareCode(String shareCode);
}
