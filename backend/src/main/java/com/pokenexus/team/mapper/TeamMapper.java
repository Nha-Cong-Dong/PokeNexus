package com.pokenexus.team.mapper;

import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.team.dto.TeamResponse;
import com.pokenexus.team.entity.Team;
import com.pokenexus.team.entity.TeamMember;

@Component
public class TeamMapper {

    public TeamResponse toResponse(Team team, Map<Integer, PokemonRef> pokemonById) {
        List<TeamResponse.Member> members = team.getMembers().stream()
                .sorted(Comparator.comparingInt(TeamMember::getSlot))
                .map(member -> toMember(member, pokemonById.get(member.getPokemonId())))
                .toList();
        return new TeamResponse(
                team.getShareCode(),
                team.getName(),
                team.getSynergyScore() == null ? null : team.getSynergyScore().doubleValue(),
                team.getCreatedAt().toInstant(ZoneOffset.UTC),
                members);
    }

    private static TeamResponse.Member toMember(TeamMember member, PokemonRef pokemon) {
        if (pokemon == null) {
            throw new IllegalStateException("Team member references missing Pokémon " + member.getPokemonId());
        }
        return new TeamResponse.Member(member.getSlot(), pokemon.id(), pokemon.name(), pokemon.types(),
                member.getNickname());
    }
}
