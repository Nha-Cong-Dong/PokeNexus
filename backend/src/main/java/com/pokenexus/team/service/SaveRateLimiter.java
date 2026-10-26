package com.pokenexus.team.service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.pokenexus.common.config.AppProperties;
import com.pokenexus.common.exception.RateLimitedException;

@Component
public class SaveRateLimiter {

    public static final Duration WINDOW = Duration.ofMinutes(1);
    public static final int MAX_TRACKED_CLIENTS = 10_000;

    private static final long MILLIS_PER_SECOND = 1000;

    private final int limitPerWindow;
    private final Clock clock;
    private final ConcurrentMap<String, Window> windows = new ConcurrentHashMap<>();

    @Autowired
    public SaveRateLimiter(AppProperties properties) {
        this(properties.team().saveLimitPerMinute(), Clock.systemUTC());
    }

    SaveRateLimiter(int limitPerWindow, Clock clock) {
        if (limitPerWindow < 1) {
            throw new IllegalArgumentException("app.team.save-limit-per-minute must be at least 1");
        }
        this.limitPerWindow = limitPerWindow;
        this.clock = clock;
    }

    public void acquire(String clientKey) {
        Instant now = clock.instant();
        if (windows.size() > MAX_TRACKED_CLIENTS) {
            windows.values().removeIf(window -> window.isExpired(now));
        }
        Window window = windows.compute(clientKey, (key, current) ->
                current == null || current.isExpired(now) ? new Window(now.plus(WINDOW), 1) : current.increment());
        if (window.count() > limitPerWindow) {
            long millisLeft = Duration.between(now, window.end()).toMillis();
            long retryAfter = (millisLeft + MILLIS_PER_SECOND - 1) / MILLIS_PER_SECOND;
            throw new RateLimitedException("Save limit exceeded, retry later", retryAfter);
        }
    }

    private record Window(Instant end, int count) {

        boolean isExpired(Instant now) {
            return !now.isBefore(end);
        }

        Window increment() {
            return new Window(end, count + 1);
        }
    }
}
