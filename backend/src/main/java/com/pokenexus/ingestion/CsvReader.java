package com.pokenexus.ingestion;

import java.io.IOException;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

public class CsvReader {

    private static final CSVFormat FORMAT = CSVFormat.DEFAULT.builder()
            .setHeader()
            .setSkipHeaderRecord(true)
            .setTrim(true)
            .get();

    private final Path directory;

    public CsvReader(Path directory) {
        this.directory = directory;
    }

    public List<Row> read(String fileName) {
        Path file = directory.resolve(fileName);
        if (!Files.isRegularFile(file)) {
            throw new IllegalStateException("CSV file not found: " + file.toAbsolutePath().normalize());
        }
        try (Reader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8);
             CSVParser parser = FORMAT.parse(reader)) {
            List<Row> rows = new ArrayList<>();
            for (CSVRecord csvRecord : parser) {
                rows.add(new Row(fileName, csvRecord));
            }
            return rows;
        } catch (IOException | UncheckedIOException ex) {
            throw new IllegalStateException("Cannot read " + fileName + ": " + ex.getMessage(), ex);
        }
    }

    public record Row(String fileName, CSVRecord csvRecord) {

        public long line() {
            return csvRecord.getRecordNumber() + 1;
        }

        public String text(String column) {
            String value = value(column);
            if (value.isEmpty()) {
                throw error(column, "value is empty");
            }
            return value;
        }

        public int integer(String column) {
            String value = text(column);
            try {
                return Integer.parseInt(value);
            } catch (NumberFormatException ex) {
                throw error(column, "'" + value + "' is not an integer");
            }
        }

        public Integer optionalInteger(String column) {
            return value(column).isEmpty() ? null : integer(column);
        }

        public boolean flag(String column) {
            return switch (text(column)) {
                case "1" -> true;
                case "0" -> false;
                default -> throw error(column, "'" + value(column) + "' is not 0 or 1");
            };
        }

        public IllegalStateException error(String column, String problem) {
            return new IllegalStateException(
                    "%s line %d, column '%s': %s".formatted(fileName, line(), column, problem));
        }

        private String value(String column) {
            if (!csvRecord.isMapped(column)) {
                throw error(column, "column is missing");
            }
            return csvRecord.get(column);
        }
    }
}
