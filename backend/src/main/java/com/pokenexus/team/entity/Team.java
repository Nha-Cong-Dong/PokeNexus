package com.pokenexus.team.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "teams")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "bigint unsigned")
    private Long id;

    @Column(name = "user_id", columnDefinition = "bigint unsigned")
    private Long userId;

    @Column(nullable = false, length = 60)
    private String name;

    @Column(name = "share_code", nullable = false, columnDefinition = "char(8)")
    private String shareCode;

    @Column(name = "synergy_score", columnDefinition = "decimal(5,2)")
    private BigDecimal synergyScore;

    @Column(name = "created_at", nullable = false, columnDefinition = "datetime")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false, columnDefinition = "datetime")
    private LocalDateTime updatedAt;

    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TeamMember> members = new ArrayList<>();

    public Team(String name, String shareCode, BigDecimal synergyScore, LocalDateTime createdAt) {
        this.name = name;
        this.shareCode = shareCode;
        this.synergyScore = synergyScore;
        this.createdAt = createdAt;
    }

    public void addMember(int slot, int pokemonId, String nickname) {
        members.add(new TeamMember(this, slot, pokemonId, nickname));
    }

    public List<TeamMember> getMembers() {
        return Collections.unmodifiableList(members);
    }
}
