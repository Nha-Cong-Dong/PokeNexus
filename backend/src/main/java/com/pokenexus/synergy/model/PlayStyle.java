package com.pokenexus.synergy.model;

public enum PlayStyle {

    BALANCE(0.40, 0.20, 0.25, 0.15, null, null),
    HYPER_OFFENSE(0.25, 0.25, 0.35, 0.15, 80, null),
    BULKY(0.50, 0.10, 0.25, 0.15, null, null),
    TRICK_ROOM(0.30, 0.15, 0.40, 0.15, null, 60);

    private final double defenseWeight;
    private final double offenseWeight;
    private final double roleWeight;
    private final double powerWeight;
    private final Integer minBaseSpeed;
    private final Integer maxBaseSpeed;

    PlayStyle(double defenseWeight, double offenseWeight, double roleWeight, double powerWeight,
              Integer minBaseSpeed, Integer maxBaseSpeed) {
        this.defenseWeight = defenseWeight;
        this.offenseWeight = offenseWeight;
        this.roleWeight = roleWeight;
        this.powerWeight = powerWeight;
        this.minBaseSpeed = minBaseSpeed;
        this.maxBaseSpeed = maxBaseSpeed;
    }

    public double defenseWeight() {
        return defenseWeight;
    }

    public double offenseWeight() {
        return offenseWeight;
    }

    public double roleWeight() {
        return roleWeight;
    }

    public double powerWeight() {
        return powerWeight;
    }

    public boolean allowsBaseSpeed(int baseSpeed) {
        return (minBaseSpeed == null || baseSpeed >= minBaseSpeed)
                && (maxBaseSpeed == null || baseSpeed <= maxBaseSpeed);
    }
}
