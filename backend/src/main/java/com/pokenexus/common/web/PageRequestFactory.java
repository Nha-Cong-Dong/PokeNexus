package com.pokenexus.common.web;

import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;

public final class PageRequestFactory {

    public static final int DEFAULT_SIZE = 24;
    public static final int MAX_SIZE = 100;
    public static final String TIE_BREAKER = "id";

    private PageRequestFactory() {
    }

    public static PageRequest of(Integer page, Integer size, String sort, Set<String> allowedProperties) {
        int pageNumber = page == null ? 0 : page;
        int pageSize = size == null ? DEFAULT_SIZE : size;
        if (pageNumber < 0) {
            throw invalid("page must be >= 0");
        }
        if (pageSize < 1 || pageSize > MAX_SIZE) {
            throw invalid("size must be between 1 and " + MAX_SIZE);
        }
        return PageRequest.of(pageNumber, pageSize, parseSort(sort, allowedProperties));
    }

    private static Sort parseSort(String sort, Set<String> allowedProperties) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(TIE_BREAKER);
        }
        String[] parts = sort.split(",", -1);
        String property = parts[0].trim();
        if (!allowedProperties.contains(property)) {
            throw invalid("sort property must be one of " + allowedProperties);
        }
        Sort.Direction direction = Sort.Direction.ASC;
        if (parts.length == 2) {
            direction = Sort.Direction.fromOptionalString(parts[1].trim())
                    .orElseThrow(() -> invalid("sort direction must be asc or desc"));
        } else if (parts.length > 2) {
            throw invalid("sort must look like <property>,<asc|desc>");
        }
        Sort primary = Sort.by(direction, property);
        return TIE_BREAKER.equals(property) ? primary : primary.and(Sort.by(TIE_BREAKER));
    }

    private static ApiException invalid(String detail) {
        return new ApiException(ErrorCode.INVALID_PARAMETER, detail);
    }
}
