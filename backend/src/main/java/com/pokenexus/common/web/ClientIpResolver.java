package com.pokenexus.common.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import com.pokenexus.common.config.AppProperties;

@Component
public class ClientIpResolver {

    private final String trustedHeader;

    public ClientIpResolver(AppProperties properties) {
        String header = properties.team().clientIpHeader();
        this.trustedHeader = header == null ? "" : header.strip();
    }

    public String resolve(HttpServletRequest request) {
        if (!trustedHeader.isEmpty()) {
            String value = request.getHeader(trustedHeader);
            if (value != null && !value.isBlank()) {
                return value.strip();
            }
        }
        return request.getRemoteAddr();
    }
}
