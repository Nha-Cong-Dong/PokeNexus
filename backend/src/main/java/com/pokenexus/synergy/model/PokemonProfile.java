package com.pokenexus.synergy.model;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

import com.pokenexus.common.domain.FormCategory;
import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.pokedex.dto.PokemonCatalogEntry;
import com.pokenexus.pokedex.dto.PokemonRef;
import com.pokenexus.pokedex.dto.Stats;

public final class PokemonProfile {

    private final PokemonCatalogEntry entry;
    private final double[] defenseMultipliers;
    private final int[] defenseScores;
    private final boolean[] superEffectiveAgainst;
    private final Set<PokemonType> typeCombination;

    public PokemonProfile(PokemonCatalogEntry entry, double[] defenseMultipliers, boolean[] superEffectiveAgainst) {
        if (defenseMultipliers.length != PokemonType.COUNT) {
            throw new IllegalArgumentException("Expected " + PokemonType.COUNT + " defense multipliers");
        }
        if (superEffectiveAgainst.length != PokemonType.COUNT) {
            throw new IllegalArgumentException("Expected offensive coverage of " + PokemonType.COUNT + " types");
        }
        this.entry = entry;
        this.defenseMultipliers = defenseMultipliers.clone();
        this.superEffectiveAgainst = superEffectiveAgainst.clone();
        this.defenseScores = new int[PokemonType.COUNT];
        for (int index = 0; index < PokemonType.COUNT; index++) {
            defenseScores[index] = DefenseScale.scoreOf(defenseMultipliers[index]);
        }
        this.typeCombination = Set.copyOf(EnumSet.copyOf(entry.types()));
    }

    public int id() {
        return entry.id();
    }

    public String name() {
        return entry.name();
    }

    public List<PokemonType> types() {
        return entry.types();
    }

    public Set<PokemonType> typeCombination() {
        return typeCombination;
    }

    public FormCategory formCategory() {
        return entry.formCategory();
    }

    public boolean legendary() {
        return entry.legendary();
    }

    public boolean mythical() {
        return entry.mythical();
    }

    public boolean fullyEvolved() {
        return entry.fullyEvolved();
    }

    public Stats stats() {
        return entry.stats();
    }

    public int baseStatTotal() {
        return entry.baseStatTotal();
    }

    public double defenseMultiplier(PokemonType attacking) {
        return defenseMultipliers[attacking.index()];
    }

    public int defenseScore(PokemonType attacking) {
        return defenseScores[attacking.index()];
    }

    public boolean hitsSuperEffectively(PokemonType defending) {
        return superEffectiveAgainst[defending.index()];
    }

    public PokemonRef toRef() {
        return new PokemonRef(entry.id(), entry.name(), entry.types().stream().map(PokemonType::identifier).toList());
    }
}
