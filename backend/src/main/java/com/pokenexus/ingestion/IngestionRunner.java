package com.pokenexus.ingestion;

import java.nio.file.Path;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import com.pokenexus.common.config.AppProperties;
import com.pokenexus.ingestion.loader.EvolutionLoader;
import com.pokenexus.ingestion.loader.GenerationLoader;
import com.pokenexus.ingestion.loader.PokemonLoader;
import com.pokenexus.ingestion.loader.SpeciesLoader;
import com.pokenexus.ingestion.loader.TypeLoader;

@Component
@Order(IngestionRunner.ORDER)
public class IngestionRunner implements ApplicationRunner {

    public static final int ORDER = 0;

    private static final Logger log = LoggerFactory.getLogger(IngestionRunner.class);

    private final AppProperties properties;
    private final JdbcTemplate jdbc;
    private final TransactionTemplate transactionTemplate;
    private final TypeLoader typeLoader;
    private final GenerationLoader generationLoader;
    private final SpeciesLoader speciesLoader;
    private final PokemonLoader pokemonLoader;
    private final EvolutionLoader evolutionLoader;

    public IngestionRunner(AppProperties properties, JdbcTemplate jdbc, TransactionTemplate transactionTemplate,
                           TypeLoader typeLoader, GenerationLoader generationLoader, SpeciesLoader speciesLoader,
                           PokemonLoader pokemonLoader, EvolutionLoader evolutionLoader) {
        this.properties = properties;
        this.jdbc = jdbc;
        this.transactionTemplate = transactionTemplate;
        this.typeLoader = typeLoader;
        this.generationLoader = generationLoader;
        this.speciesLoader = speciesLoader;
        this.pokemonLoader = pokemonLoader;
        this.evolutionLoader = evolutionLoader;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!properties.ingestion().enabled()) {
            log.info("CSV ingestion is disabled (app.ingestion.enabled=false)");
            return;
        }
        long existing = countPokemon();
        if (existing > 0) {
            log.info("CSV ingestion skipped: table pokemon already has {} rows", existing);
            return;
        }
        ingest(Path.of(properties.ingestion().csvDir()));
    }

    public void ingest(Path csvDir) {
        CsvReader csv = new CsvReader(csvDir);
        long start = System.nanoTime();
        log.info("CSV ingestion started from {}", csvDir.toAbsolutePath().normalize());
        int[] counts;
        try {
            counts = transactionTemplate.execute(status -> new int[] {
                    typeLoader.load(csv),
                    generationLoader.load(csv),
                    speciesLoader.load(csv),
                    pokemonLoader.load(csv),
                    evolutionLoader.load(csv)});
        } catch (RuntimeException ex) {
            log.error("CSV ingestion failed and was rolled back: {}", ex.getMessage());
            throw ex;
        }
        log.info("CSV ingestion finished in {} ms: {} types, {} generations, {} species, {} pokemon, {} evolution links",
                (System.nanoTime() - start) / 1_000_000, counts[0], counts[1], counts[2], counts[3], counts[4]);
    }

    private long countPokemon() {
        Long count = jdbc.queryForObject("SELECT COUNT(*) FROM pokemon", Long.class);
        return count != null ? count : 0;
    }
}
