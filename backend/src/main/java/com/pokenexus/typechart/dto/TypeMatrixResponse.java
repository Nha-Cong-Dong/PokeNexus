package com.pokenexus.typechart.dto;

import java.util.List;

public record TypeMatrixResponse(List<String> types, List<List<Double>> multipliers) {
}
