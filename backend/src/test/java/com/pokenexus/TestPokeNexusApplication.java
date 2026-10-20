package com.pokenexus;

import org.springframework.boot.SpringApplication;

public class TestPokeNexusApplication {

    public static void main(String[] args) {
        SpringApplication.from(PokeNexusApplication::main).with(TestcontainersConfiguration.class).run(args);
    }
}
