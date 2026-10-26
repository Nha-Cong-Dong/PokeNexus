package com.pokenexus.team.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "team_members")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TeamMember {

    @EmbeddedId
    private TeamMemberId id;

    @MapsId("teamId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(name = "pokemon_id", nullable = false, columnDefinition = "smallint unsigned")
    private Integer pokemonId;

    @Column(length = 30)
    private String nickname;

    TeamMember(Team team, int slot, int pokemonId, String nickname) {
        this.id = new TeamMemberId(null, slot);
        this.team = team;
        this.pokemonId = pokemonId;
        this.nickname = nickname;
    }

    public int getSlot() {
        return id.getSlot();
    }
}
