package com.pokenexus.common.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import com.pokenexus.common.exception.ApiException;

class PageRequestFactoryTest {

    private static final Set<String> ALLOWED = Set.of("id", "name", "speed");

    @Test
    void usesDefaultsWhenParametersAreMissing() {
        PageRequest request = PageRequestFactory.of(null, null, null, ALLOWED);

        assertThat(request.getPageNumber()).isZero();
        assertThat(request.getPageSize()).isEqualTo(24);
        assertThat(request.getSort()).isEqualTo(Sort.by("id"));
    }

    @Test
    void addsIdAsTieBreakerForOtherProperties() {
        PageRequest request = PageRequestFactory.of(2, 100, "speed,desc", ALLOWED);

        assertThat(request.getPageNumber()).isEqualTo(2);
        assertThat(request.getSort()).isEqualTo(Sort.by(Sort.Direction.DESC, "speed").and(Sort.by("id")));
        assertThat(PageRequestFactory.of(0, 1, "name", ALLOWED).getSort())
                .isEqualTo(Sort.by("name").and(Sort.by("id")));
    }

    @Test
    void rejectsSizePageAndSortOutsideLimits() {
        assertThatThrownBy(() -> PageRequestFactory.of(0, 101, null, ALLOWED))
                .isInstanceOf(ApiException.class).hasMessageContaining("size must be between 1 and 100");
        assertThatThrownBy(() -> PageRequestFactory.of(0, 0, null, ALLOWED)).isInstanceOf(ApiException.class);
        assertThatThrownBy(() -> PageRequestFactory.of(-1, 10, null, ALLOWED))
                .isInstanceOf(ApiException.class).hasMessageContaining("page");
        assertThatThrownBy(() -> PageRequestFactory.of(0, 10, "weight,asc", ALLOWED))
                .isInstanceOf(ApiException.class).hasMessageContaining("sort property");
        assertThatThrownBy(() -> PageRequestFactory.of(0, 10, "speed,up", ALLOWED))
                .isInstanceOf(ApiException.class).hasMessageContaining("asc or desc");
    }
}
