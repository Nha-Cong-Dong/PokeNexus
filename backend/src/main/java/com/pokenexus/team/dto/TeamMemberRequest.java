package com.pokenexus.team.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TeamMemberRequest(
        @NotNull @Min(1) @Max(6) Integer slot,
        @NotNull Integer pokemonId,
        @Size(max = 30) String nickname) {

    public TeamMemberRequest {
        nickname = nickname == null || nickname.isBlank() ? null : nickname.strip();
    }
}
