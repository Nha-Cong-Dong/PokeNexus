CREATE TABLE teams (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id       BIGINT UNSIGNED NULL,
    name          VARCHAR(60)     NOT NULL,
    share_code    CHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
    synergy_score DECIMAL(5, 2)   NULL,
    created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_teams_share_code UNIQUE (share_code)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE team_members (
    team_id    BIGINT UNSIGNED   NOT NULL,
    slot       TINYINT UNSIGNED  NOT NULL,
    pokemon_id SMALLINT UNSIGNED NOT NULL,
    nickname   VARCHAR(30)       NULL,
    PRIMARY KEY (team_id, slot),
    CONSTRAINT uk_team_members_pokemon UNIQUE (team_id, pokemon_id),
    CONSTRAINT fk_team_members_teams FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE,
    CONSTRAINT fk_team_members_pokemon FOREIGN KEY (pokemon_id) REFERENCES pokemon (id),
    CONSTRAINT ck_team_members_slot CHECK (slot BETWEEN 1 AND 6)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
