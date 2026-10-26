package com.pokenexus.team.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTeamRequest(
        @NotBlank @Size(max = 60) String name,
        @NotNull @Size(min = 1, max = 6) List<@NotNull @Valid TeamMemberRequest> members) {

    public CreateTeamRequest {
        name = name == null ? null : name.strip();
    }
}
