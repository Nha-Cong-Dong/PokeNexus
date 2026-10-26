package com.pokenexus.team.dto;

import java.time.Instant;
import java.util.List;

public record TeamResponse(
        String shareCode,
        String name,
        Double synergyScore,
        Instant createdAt,
        List<Member> members) {

    public record Member(int slot, int id, String name, List<String> types, String nickname) {
    }
}
