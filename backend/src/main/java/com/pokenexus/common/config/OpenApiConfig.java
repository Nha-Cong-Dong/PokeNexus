package com.pokenexus.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI pokeNexusOpenApi() {
        return new OpenAPI().info(new Info()
                .title("PokeNexus API")
                .version("v1")
                .description("Pokédex lookup and VGC team synergy analysis. Data sourced from PokéAPI CSV.")
                .license(new License().name("MIT")));
    }
}
