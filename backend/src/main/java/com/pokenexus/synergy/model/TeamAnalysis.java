package com.pokenexus.synergy.model;

import java.util.List;
import java.util.function.ToIntFunction;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.pokedex.dto.Stats;

public final class TeamAnalysis {

    public static final int MAX_TEAM_SCORE = 100;
    public static final int PRESSURE_PENALTY = 4;
    public static final int CRITICAL_HOLE_PENALTY = 8;
    public static final int CRITICAL_WEAKNESS_THRESHOLD = 2;

    private final List<PokemonProfile> members;
    private final int[] weakCount = new int[PokemonType.COUNT];
    private final int[] resistCount = new int[PokemonType.COUNT];
    private final int[] pressure = new int[PokemonType.COUNT];
    private final boolean[] criticalHole = new boolean[PokemonType.COUNT];
    private final boolean[] covered;
    private final int teamScore;

    public TeamAnalysis(List<PokemonProfile> members, boolean[] covered) {
        if (covered.length != PokemonType.COUNT) {
            throw new IllegalArgumentException("Expected coverage of " + PokemonType.COUNT + " types");
        }
        this.members = List.copyOf(members);
        this.covered = covered.clone();
        int totalPressure = 0;
        int criticalHoles = 0;
        for (PokemonType attacking : PokemonType.values()) {
            int index = attacking.index();
            int weakness = 0;
            for (PokemonProfile member : this.members) {
                int score = member.defenseScore(attacking);
                if (score < 0) {
                    weakness -= score;
                    weakCount[index]++;
                } else if (score > 0) {
                    resistCount[index]++;
                }
            }
            pressure[index] = Math.max(0, weakness - resistCount[index]);
            criticalHole[index] = weakness >= CRITICAL_WEAKNESS_THRESHOLD && resistCount[index] == 0;
            totalPressure += pressure[index];
            criticalHoles += criticalHole[index] ? 1 : 0;
        }
        int raw = MAX_TEAM_SCORE - PRESSURE_PENALTY * totalPressure - CRITICAL_HOLE_PENALTY * criticalHoles;
        this.teamScore = Math.clamp(raw, 0, MAX_TEAM_SCORE);
    }

    public List<PokemonProfile> members() {
        return members;
    }

    public int weakCount(PokemonType attacking) {
        return weakCount[attacking.index()];
    }

    public int resistCount(PokemonType attacking) {
        return resistCount[attacking.index()];
    }

    public int pressure(PokemonType attacking) {
        return pressure[attacking.index()];
    }

    public boolean criticalHole(PokemonType attacking) {
        return criticalHole[attacking.index()];
    }

    public boolean covered(PokemonType defending) {
        return covered[defending.index()];
    }

    public int teamScore() {
        return teamScore;
    }

    public double averageStat(ToIntFunction<Stats> stat) {
        return members.stream().mapToInt(member -> stat.applyAsInt(member.stats())).average().orElse(0);
    }
}
