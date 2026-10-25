CREATE TABLE evolution_chains (
    id SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE species (
    id                 SMALLINT UNSIGNED NOT NULL,
    name               VARCHAR(50)       NOT NULL,
    generation_id      TINYINT UNSIGNED  NOT NULL,
    evolution_chain_id SMALLINT UNSIGNED NULL,
    is_legendary       BOOLEAN           NOT NULL DEFAULT FALSE,
    is_mythical        BOOLEAN           NOT NULL DEFAULT FALSE,
    is_fully_evolved   BOOLEAN           NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT uk_species_name UNIQUE (name),
    INDEX idx_species_generation (generation_id),
    CONSTRAINT fk_species_generations FOREIGN KEY (generation_id) REFERENCES generations (id),
    CONSTRAINT fk_species_evolution_chains FOREIGN KEY (evolution_chain_id) REFERENCES evolution_chains (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE pokemon (
    id                SMALLINT UNSIGNED NOT NULL,
    species_id        SMALLINT UNSIGNED NOT NULL,
    name              VARCHAR(60)       NOT NULL,
    form_category     VARCHAR(10)       NOT NULL,
    is_default        BOOLEAN           NOT NULL DEFAULT TRUE,
    primary_type_id   TINYINT UNSIGNED  NOT NULL,
    secondary_type_id TINYINT UNSIGNED  NULL,
    hp                TINYINT UNSIGNED  NOT NULL,
    attack            TINYINT UNSIGNED  NOT NULL,
    defense           TINYINT UNSIGNED  NOT NULL,
    special_attack    TINYINT UNSIGNED  NOT NULL,
    special_defense   TINYINT UNSIGNED  NOT NULL,
    speed             TINYINT UNSIGNED  NOT NULL,
    base_stat_total   SMALLINT UNSIGNED GENERATED ALWAYS AS
        (hp + attack + defense + special_attack + special_defense + speed) STORED,
    height_dm         SMALLINT UNSIGNED NOT NULL,
    weight_hg         SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_pokemon_name UNIQUE (name),
    INDEX idx_pokemon_species (species_id),
    INDEX idx_pokemon_primary_type (primary_type_id),
    INDEX idx_pokemon_secondary_type (secondary_type_id),
    INDEX idx_pokemon_bst (base_stat_total),
    INDEX idx_pokemon_speed (speed),
    INDEX idx_pokemon_form_category (form_category),
    CONSTRAINT fk_pokemon_species FOREIGN KEY (species_id) REFERENCES species (id),
    CONSTRAINT fk_pokemon_primary_types FOREIGN KEY (primary_type_id) REFERENCES types (id),
    CONSTRAINT fk_pokemon_secondary_types FOREIGN KEY (secondary_type_id) REFERENCES types (id),
    CONSTRAINT ck_pokemon_form_category CHECK (form_category IN ('DEFAULT', 'REGIONAL', 'MEGA', 'GMAX', 'OTHER')),
    CONSTRAINT ck_pokemon_distinct_types CHECK (secondary_type_id IS NULL OR secondary_type_id <> primary_type_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE evolution_links (
    id              INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    chain_id        SMALLINT UNSIGNED NOT NULL,
    from_species_id SMALLINT UNSIGNED NOT NULL,
    to_species_id   SMALLINT UNSIGNED NOT NULL,
    trigger_name    VARCHAR(30)       NOT NULL,
    min_level       TINYINT UNSIGNED  NULL,
    item_name       VARCHAR(50)       NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_evolution_links_to_species UNIQUE (to_species_id),
    INDEX idx_evolution_links_chain (chain_id),
    CONSTRAINT fk_evolution_links_evolution_chains FOREIGN KEY (chain_id) REFERENCES evolution_chains (id),
    CONSTRAINT fk_evolution_links_from_species FOREIGN KEY (from_species_id) REFERENCES species (id),
    CONSTRAINT fk_evolution_links_to_species FOREIGN KEY (to_species_id) REFERENCES species (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
