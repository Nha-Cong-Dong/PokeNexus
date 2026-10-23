package com.pokenexus.common.domain;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.Optional;
import java.util.Set;

public enum FormCategory {
    DEFAULT,
    REGIONAL,
    MEGA,
    GMAX,
    OTHER;

    public static final Set<FormCategory> SHOWN_BY_DEFAULT = EnumSet.of(DEFAULT, REGIONAL);

    public boolean isShownByDefault() {
        return SHOWN_BY_DEFAULT.contains(this);
    }

    public static Optional<FormCategory> fromName(String name) {
        if (name == null) {
            return Optional.empty();
        }
        return Arrays.stream(values())
                .filter(category -> category.name().equals(name))
                .findFirst();
    }
}
