package com.pokenexus.common.exception;

public class RateLimitedException extends ApiException {

    private final long retryAfterSeconds;

    public RateLimitedException(String detail, long retryAfterSeconds) {
        super(ErrorCode.RATE_LIMITED, detail);
        this.retryAfterSeconds = Math.max(1, retryAfterSeconds);
    }

    public long retryAfterSeconds() {
        return retryAfterSeconds;
    }
}
