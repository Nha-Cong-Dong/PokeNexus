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
    private final int maxTrackedClients;
    private final Clock clock;
    private final ConcurrentMap<String, Window> windows = new ConcurrentHashMap<>();

    @Autowired
    public SaveRateLimiter(AppProperties properties) {
        this(properties.team().saveLimitPerMinute(), MAX_TRACKED_CLIENTS, Clock.systemUTC());
    }

    SaveRateLimiter(int limitPerWindow, int maxTrackedClients, Clock clock) {
        if (limitPerWindow < 1) {
            throw new IllegalArgumentException("app.team.save-limit-per-minute must be at least 1");
        }
        if (maxTrackedClients < 1) {
            throw new IllegalArgumentException("maxTrackedClients must be at least 1");
        }
        this.limitPerWindow = limitPerWindow;
        this.maxTrackedClients = maxTrackedClients;
        this.clock = clock;
    }

    public void acquire(String clientKey) {
        Instant now = clock.instant();
        if (!windows.containsKey(clientKey) && windows.size() >= maxTrackedClients) {
            windows.values().removeIf(window -> window.isExpired(now));
            if (windows.size() >= maxTrackedClients) {
                throw new RateLimitedException("Too many clients are saving right now, retry later",
                        secondsUntil(now, earliestEnd(now)));
            }
        }
        Window window = windows.compute(clientKey, (key, current) ->
                current == null || current.isExpired(now) ? new Window(now.plus(WINDOW), 1) : current.increment());
        if (window.count() > limitPerWindow) {
            throw new RateLimitedException("Save limit exceeded, retry later", secondsUntil(now, window.end()));
        }
    }

    int trackedClients() {
        return windows.size();
    }

    private Instant earliestEnd(Instant now) {
        return windows.values().stream()
                .map(Window::end)
                .min(Instant::compareTo)
                .orElse(now.plus(WINDOW));
    }

    private static long secondsUntil(Instant now, Instant end) {
        long millisLeft = Math.max(0, Duration.between(now, end).toMillis());
        return Math.max(1, (millisLeft + MILLIS_PER_SECOND - 1) / MILLIS_PER_SECOND);
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
