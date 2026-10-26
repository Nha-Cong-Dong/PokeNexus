package com.pokenexus.typechart.service;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.pokenexus.common.domain.PokemonType;
import com.pokenexus.typechart.entity.TypeEfficacy;
import com.pokenexus.typechart.entity.TypeEfficacyId;
import com.pokenexus.typechart.repository.TypeEfficacyRepository;

public final class TypeChartFixture {

    private static final Path TYPE_EFFICACY_CSV = Path.of("src/test/resources/csv/type_efficacy.csv");

    private TypeChartFixture() {
    }

    public static TypeChartService loadedService() {
        TypeEfficacyRepository repository = mock(TypeEfficacyRepository.class);
        when(repository.findAll()).thenReturn(efficacyRows());
        TypeChartService service = new TypeChartService(repository);
        service.reload();
        return service;
    }

    public static List<TypeEfficacy> efficacyRows() {
        try {
            return Files.readAllLines(TYPE_EFFICACY_CSV).stream()
                    .skip(1)
                    .filter(line -> !line.isBlank())
                    .map(line -> line.trim().split(","))
                    .filter(cells -> isStandard(cells[0]) && isStandard(cells[1]))
                    .map(cells -> new TypeEfficacy(
                            new TypeEfficacyId(Integer.parseInt(cells[0]), Integer.parseInt(cells[1])),
                            Integer.parseInt(cells[2])))
                    .toList();
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
    }

    private static boolean isStandard(String typeId) {
        return PokemonType.fromId(Integer.parseInt(typeId)).isPresent();
    }
}
