package com.pokenexus.synergy.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.pokenexus.pokedex.dto.Stats;
import com.pokenexus.synergy.model.PlayStyle;
import com.pokenexus.synergy.model.PokemonProfile;
import com.pokenexus.synergy.model.TeamStatProfile;

@Component
public class RoleScorer {

    public static final double STRONG_ATTACK = 140;
    public static final double FAST_SPEED_REFERENCE = 130;
    public static final double TRICK_ROOM_SPEED_CEILING = 80;
    public static final double BULK_REFERENCE = 115;
    public static final double SKEW_REASON_THRESHOLD = 0.3;
    public static final double LEAN_REASON_THRESHOLD = 0.2;
    public static final int BULKY_REASON_MIN = 95;
    public static final int STRONG_REASON_MIN = 110;

    public RoleFit score(PokemonProfile candidate, TeamStatProfile team, PlayStyle style) {
        Stats stats = candidate.stats();
        return switch (style) {
            case BALANCE -> balance(stats, team);
            case HYPER_OFFENSE -> hyperOffense(stats);
            case BULKY -> bulky(stats, team);
            case TRICK_ROOM -> trickRoom(stats);
        };
    }

    private RoleFit balance(Stats stats, TeamStatProfile team) {
        List<String> reasons = new ArrayList<>();
        double attackFit = attackComplement(stats, team, reasons);
        double defenseFit = defenseComplement(stats, team, reasons);
        double speedFit = speedComplement(stats, team, reasons);
        return new RoleFit(0.4 * attackFit + 0.3 * defenseFit + 0.3 * speedFit, reasons);
    }

    private RoleFit hyperOffense(Stats stats) {
        double speed = capped(stats.speed() / FAST_SPEED_REFERENCE);
        double power = capped(strongerAttack(stats) / STRONG_ATTACK);
        boolean fast = stats.speed() >= TeamStatProfile.FAST_BASE_SPEED;
        boolean strong = strongerAttack(stats) >= STRONG_REASON_MIN;
        String speedText = "Tốc độ gốc %d (tối đa %d ở cấp 50)".formatted(stats.speed(), maxLevel50Speed(stats.speed()));
        String powerText = "%s %d".formatted(attackLabel(stats), strongerAttack(stats));
        List<String> reasons = new ArrayList<>();
        if (fast && strong) {
            reasons.add("%s và %s: đánh trước, đánh mạnh".formatted(speedText, powerText));
        } else if (fast) {
            reasons.add(speedText + ": đánh trước phần lớn đối thủ");
        } else if (strong) {
            reasons.add(powerText + ": sát thương lớn");
        }
        return new RoleFit(0.55 * speed + 0.45 * power, reasons);
    }

    private RoleFit bulky(Stats stats, TeamStatProfile team) {
        List<String> reasons = new ArrayList<>();
        double bulk = capped(bulkiness(stats) / BULK_REFERENCE);
        if (bulkiness(stats) >= BULKY_REASON_MIN) {
            reasons.add("Trâu: HP %d, Phòng thủ %d, Phòng thủ đặc biệt %d".formatted(
                    stats.hp(), stats.defense(), stats.specialDefense()));
        }
        double defenseFit = defenseComplement(stats, team, reasons);
        return new RoleFit(0.6 * bulk + 0.4 * defenseFit, reasons);
    }

    private RoleFit trickRoom(Stats stats) {
        double slow = capped(1 - stats.speed() / TRICK_ROOM_SPEED_CEILING);
        double power = capped(strongerAttack(stats) / STRONG_ATTACK);
        double bulk = capped(bulkiness(stats) / BULK_REFERENCE);
        List<String> reasons = List.of("Tốc độ gốc %d hợp Trick Room, %s %d".formatted(
                stats.speed(), attackLabel(stats), strongerAttack(stats)));
        return new RoleFit(0.45 * slow + 0.35 * power + 0.2 * bulk, reasons);
    }

    private static double attackComplement(Stats stats, TeamStatProfile team, List<String> reasons) {
        double skew = team.attackSkew();
        double lean = TeamStatProfile.attackLean(stats);
        double power = capped(strongerAttack(stats) / STRONG_ATTACK);
        double fit = (1 - skew * lean) / 2 * power;
        if (opposes(skew, lean, SKEW_REASON_THRESHOLD) && strongerAttack(stats) >= STRONG_REASON_MIN) {
            boolean teamPhysical = skew < 0;
            reasons.add("Bù sát thương %s (%s %d) cho đội đang thiên về %s".formatted(
                    teamPhysical ? "đặc biệt" : "vật lý",
                    teamPhysical ? "Tấn công đặc biệt" : "Tấn công",
                    teamPhysical ? stats.specialAttack() : stats.attack(),
                    teamPhysical ? "vật lý" : "đặc biệt"));
        }
        return fit;
    }

    private static double defenseComplement(Stats stats, TeamStatProfile team, List<String> reasons) {
        double skew = team.defenseSkew();
        double lean = TeamStatProfile.defenseLean(stats);
        double fit = (1 - skew * lean) / 2 * capped(bulkiness(stats) / BULK_REFERENCE);
        if (opposes(skew, lean, LEAN_REASON_THRESHOLD)) {
            boolean teamWeakSpecial = skew < 0;
            reasons.add("Bù %s (%d) cho đội có %s trung bình %d".formatted(
                    teamWeakSpecial ? "phòng thủ đặc biệt" : "phòng thủ vật lý",
                    teamWeakSpecial ? stats.specialDefense() : stats.defense(),
                    teamWeakSpecial ? "phòng thủ đặc biệt" : "phòng thủ vật lý",
                    Math.round(teamWeakSpecial ? team.averageSpecialDefense() : team.averageDefense())));
        }
        return fit;
    }

    private static double speedComplement(Stats stats, TeamStatProfile team, List<String> reasons) {
        int wantedFast = Math.max(1, (int) Math.ceil(team.size() / 3.0));
        double need = capped(1 - (double) team.fastMembers() / wantedFast);
        double speed = capped(stats.speed() / FAST_SPEED_REFERENCE);
        if (team.fastMembers() == 0 && stats.speed() >= TeamStatProfile.FAST_BASE_SPEED) {
            reasons.add("Tốc độ gốc %d (tối đa %d ở cấp 50): đội chưa có thành viên nhanh".formatted(
                    stats.speed(), maxLevel50Speed(stats.speed())));
        }
        return need * speed + (1 - need) * 0.5;
    }

    private static boolean opposes(double teamSkew, double candidateLean, double skewThreshold) {
        return Math.abs(teamSkew) >= skewThreshold
                && Math.abs(candidateLean) >= TeamStatProfile.ATTACK_LEAN_THRESHOLD
                && Math.signum(teamSkew) != Math.signum(candidateLean);
    }

    static int strongerAttack(Stats stats) {
        return Math.max(stats.attack(), stats.specialAttack());
    }

    static String attackLabel(Stats stats) {
        return stats.specialAttack() > stats.attack() ? "Tấn công đặc biệt" : "Tấn công";
    }

    static double bulkiness(Stats stats) {
        return (stats.hp() + stats.defense() + stats.specialDefense()) / 3.0;
    }

    static int maxLevel50Speed(int baseSpeed) {
        int neutral = (2 * baseSpeed + 31 + 252 / 4) * 50 / 100 + 5;
        return (int) Math.floor(neutral * 1.1);
    }

    private static double capped(double value) {
        return Math.clamp(value, 0, 1);
    }

    public record RoleFit(double value, List<String> reasons) {

        public RoleFit {
            reasons = List.copyOf(reasons);
        }
    }
}
