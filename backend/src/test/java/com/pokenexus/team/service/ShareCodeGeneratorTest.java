package com.pokenexus.team.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.Test;

class ShareCodeGeneratorTest {

    private final ShareCodeGenerator generator = new ShareCodeGenerator();

    @Test
    void generatesEightBase62Characters() {
        for (int index = 0; index < 1_000; index++) {
            assertThat(generator.next()).hasSize(8).matches("[A-Za-z0-9]{8}");
        }
    }

    @Test
    void rarelyRepeatsCodes() {
        Set<String> codes = new HashSet<>();
        for (int index = 0; index < 10_000; index++) {
            codes.add(generator.next());
        }

        assertThat(codes).hasSize(10_000);
    }

    @Test
    void validatesShareCodeFormat() {
        assertThat(ShareCodeGenerator.isValid("a1B2c3D4")).isTrue();
        assertThat(ShareCodeGenerator.isValid("a1B2c3D")).isFalse();
        assertThat(ShareCodeGenerator.isValid("a1B2c3D45")).isFalse();
        assertThat(ShareCodeGenerator.isValid("a1B2-3D4")).isFalse();
        assertThat(ShareCodeGenerator.isValid(null)).isFalse();
    }
}
