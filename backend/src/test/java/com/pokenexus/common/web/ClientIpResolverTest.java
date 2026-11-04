package com.pokenexus.common.web;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import com.pokenexus.common.config.AppProperties;

class ClientIpResolverTest {

    private static ClientIpResolver resolverTrusting(String header) {
        return new ClientIpResolver(new AppProperties(
                new AppProperties.Ingestion(false, "../data/csv"),
                new AppProperties.Cors(List.of("http://localhost:5173")),
                new AppProperties.Team(10, header)));
    }

    private static MockHttpServletRequest request(String remoteAddr) {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/teams");
        request.setRemoteAddr(remoteAddr);
        return request;
    }

    @Test
    void usesTheTrustedProxyHeaderInsteadOfTheForwardedAddress() {
        MockHttpServletRequest request = request("203.0.113.7");
        request.addHeader("X-Forwarded-For", "203.0.113.7, 198.51.100.20");
        request.addHeader("CF-Connecting-IP", " 198.51.100.20 ");

        assertThat(resolverTrusting("CF-Connecting-IP").resolve(request)).isEqualTo("198.51.100.20");
    }

    @Test
    void fallsBackToTheRemoteAddressWhenTheTrustedHeaderIsMissingOrBlank() {
        MockHttpServletRequest missing = request("10.0.0.5");
        MockHttpServletRequest blank = request("10.0.0.6");
        blank.addHeader("CF-Connecting-IP", "  ");

        ClientIpResolver resolver = resolverTrusting("CF-Connecting-IP");

        assertThat(resolver.resolve(missing)).isEqualTo("10.0.0.5");
        assertThat(resolver.resolve(blank)).isEqualTo("10.0.0.6");
    }

    @Test
    void ignoresClientHeadersWhenNoHeaderIsTrusted() {
        MockHttpServletRequest request = request("10.0.0.5");
        request.addHeader("CF-Connecting-IP", "198.51.100.20");

        assertThat(resolverTrusting("").resolve(request)).isEqualTo("10.0.0.5");
        assertThat(resolverTrusting(null).resolve(request)).isEqualTo("10.0.0.5");
    }
}
