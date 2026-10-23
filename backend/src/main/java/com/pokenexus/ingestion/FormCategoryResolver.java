package com.pokenexus.ingestion;

import java.util.List;

import com.pokenexus.common.domain.FormCategory;

public final class FormCategoryResolver {

    private static final List<String> REGIONAL_MARKERS = List.of("-alola", "-galar", "-hisui", "-paldea");

    private FormCategoryResolver() {
    }

    public static FormCategory resolve(String name, boolean isDefault) {
        if (isDefault) {
            return FormCategory.DEFAULT;
        }
        if (name.contains("-totem") || name.endsWith("-cap")) {
            return FormCategory.OTHER;
        }
        if (REGIONAL_MARKERS.stream().anyMatch(name::contains)) {
            return FormCategory.REGIONAL;
        }
        if (name.contains("-mega")) {
            return FormCategory.MEGA;
        }
        if (name.endsWith("-gmax")) {
            return FormCategory.GMAX;
        }
        return FormCategory.OTHER;
    }
}
