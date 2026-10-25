CREATE TABLE types (
    id   TINYINT UNSIGNED NOT NULL,
    name VARCHAR(20)      NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_types_name UNIQUE (name)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE type_efficacy (
    attacking_type_id TINYINT UNSIGNED NOT NULL,
    defending_type_id TINYINT UNSIGNED NOT NULL,
    damage_factor     TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (attacking_type_id, defending_type_id),
    CONSTRAINT fk_type_efficacy_attacking_types FOREIGN KEY (attacking_type_id) REFERENCES types (id),
    CONSTRAINT fk_type_efficacy_defending_types FOREIGN KEY (defending_type_id) REFERENCES types (id),
    CONSTRAINT ck_type_efficacy_damage_factor CHECK (damage_factor IN (0, 50, 100, 200))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE regions (
    id   TINYINT UNSIGNED NOT NULL,
    name VARCHAR(30)      NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_regions_name UNIQUE (name)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE generations (
    id        TINYINT UNSIGNED NOT NULL,
    name      VARCHAR(30)      NOT NULL,
    region_id TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_generations_name UNIQUE (name),
    CONSTRAINT fk_generations_regions FOREIGN KEY (region_id) REFERENCES regions (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
