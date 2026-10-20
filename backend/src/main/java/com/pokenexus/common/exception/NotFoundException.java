package com.pokenexus.common.exception;

public class NotFoundException extends ApiException {

    public NotFoundException(ErrorCode errorCode, String detail) {
        super(requireNotFound(errorCode), detail);
    }

    private static ErrorCode requireNotFound(ErrorCode errorCode) {
        if (errorCode == null || errorCode.status().value() != 404) {
            throw new IllegalArgumentException("NotFoundException requires a 404 error code, got " + errorCode);
        }
        return errorCode;
    }
}
