package com.pokenexus.common.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST),
    INVALID_PARAMETER(HttpStatus.BAD_REQUEST),
    MALFORMED_JSON(HttpStatus.BAD_REQUEST),
    DUPLICATE_POKEMON(HttpStatus.BAD_REQUEST),
    DUPLICATE_SLOT(HttpStatus.BAD_REQUEST),
    UNKNOWN_POKEMON(HttpStatus.BAD_REQUEST),
    POKEMON_NOT_FOUND(HttpStatus.NOT_FOUND),
    TEAM_NOT_FOUND(HttpStatus.NOT_FOUND),
    ROUTE_NOT_FOUND(HttpStatus.NOT_FOUND),
    RATE_LIMITED(HttpStatus.TOO_MANY_REQUESTS),
    DATA_NOT_READY(HttpStatus.SERVICE_UNAVAILABLE),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR);

    private final HttpStatus status;

    ErrorCode(HttpStatus status) {
        this.status = status;
    }

    public HttpStatus status() {
        return status;
    }
}
