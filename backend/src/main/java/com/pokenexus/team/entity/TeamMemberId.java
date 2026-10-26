package com.pokenexus.team.entity;

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
public class TeamMemberId implements Serializable {

    @Column(name = "team_id", columnDefinition = "bigint unsigned")
    private Long teamId;

    @Column(name = "slot", columnDefinition = "tinyint unsigned")
    private Integer slot;
}
