package com.pokenexus.synergy.model;

import java.util.List;

import com.pokenexus.pokedex.dto.Stats;

public record TeamStatProfile(
        int size,
        double physicalAttackers,
        double specialAttackers,
        int fastMembers,
        int slowMembers,
        double averageSpeed,
        double averageDefense,
        double averageSpecialDefense) {

    public static final int FAST_BASE_SPEED = 100;
    public static final int SLOW_BASE_SPEED = 50;
    public static final double ATTACK_LEAN_THRESHOLD = 0.15;

    public static TeamStatProfile of(List<PokemonProfile> members) {
        double physical = 0;
        double special = 0;
        int fast = 0;
        int slow = 0;
        double speed = 0;
        double defense = 0;
        double specialDefense = 0;
        for (PokemonProfile member : members) {
            Stats stats = member.stats();
            double lean = attackLean(stats);
            if (lean <= -ATTACK_LEAN_THRESHOLD) {
                physical += 1;
            } else if (lean >= ATTACK_LEAN_THRESHOLD) {
                special += 1;
            } else {
                physical += 0.5;
                special += 0.5;
            }
            fast += stats.speed() >= FAST_BASE_SPEED ? 1 : 0;
            slow += stats.speed() <= SLOW_BASE_SPEED ? 1 : 0;
            speed += stats.speed();
            defense += stats.defense();
            specialDefense += stats.specialDefense();
        }
        int size = members.size();
        double divisor = Math.max(1, size);
        return new TeamStatProfile(size, physical, special, fast, slow, speed / divisor, defense / divisor,
                specialDefense / divisor);
    }

    public static double attackLean(Stats stats) {
        int stronger = Math.max(stats.attack(), stats.specialAttack());
        return stronger == 0 ? 0 : (double) (stats.specialAttack() - stats.attack()) / stronger;
    }

    public static double defenseLean(Stats stats) {
        int stronger = Math.max(stats.defense(), stats.specialDefense());
        return stronger == 0 ? 0 : (double) (stats.specialDefense() - stats.defense()) / stronger;
    }

    public double attackSkew() {
        return size == 0 ? 0 : (specialAttackers - physicalAttackers) / size;
    }

    public double defenseSkew() {
        double stronger = Math.max(averageDefense, averageSpecialDefense);
        return stronger == 0 ? 0 : (averageSpecialDefense - averageDefense) / stronger;
    }
}
