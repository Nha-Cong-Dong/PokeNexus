package com.pokenexus.team.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;

import com.pokenexus.common.exception.ErrorCode;
import com.pokenexus.common.exception.RateLimitedException;

class SaveRateLimiterTest {

    private static final Instant START = Instant.parse("2026-11-06T09:30:00Z");

    private final MutableClock clock = new MutableClock(START);
    private final SaveRateLimiter limiter = new SaveRateLimiter(10, SaveRateLimiter.MAX_TRACKED_CLIENTS, clock);

    @Test
    void allowsTenSavesPerMinuteThenAsksToRetryLater() {
        for (int save = 0; save < 10; save++) {
            limiter.acquire("10.0.0.1");
        }
        clock.advance(Duration.ofSeconds(18));

        assertThatThrownBy(() -> limiter.acquire("10.0.0.1"))
                .isInstanceOfSatisfying(RateLimitedException.class, ex -> {
                    assertThat(ex.errorCode()).isEqualTo(ErrorCode.RATE_LIMITED);
                    assertThat(ex.retryAfterSeconds()).isEqualTo(42);
                });
    }

    @Test
    void countsEachClientSeparately() {
        for (int save = 0; save < 10; save++) {
            limiter.acquire("10.0.0.1");
        }

        assertThatCode(() -> limiter.acquire("10.0.0.2")).doesNotThrowAnyException();
    }

    @Test
    void opensANewWindowAfterOneMinute() {
        for (int save = 0; save < 11; save++) {
            try {
                limiter.acquire("10.0.0.1");
            } catch (RateLimitedException ignored) {
                assertThat(save).isEqualTo(10);
            }
        }
        clock.advance(Duration.ofSeconds(60));

        assertThatCode(() -> limiter.acquire("10.0.0.1")).doesNotThrowAnyException();
    }

    @Test
    void reportsAtLeastOneSecondJustBeforeTheWindowEnds() {
        for (int save = 0; save < 10; save++) {
            limiter.acquire("10.0.0.1");
        }
        clock.advance(Duration.ofMillis(59_999));

        assertThatThrownBy(() -> limiter.acquire("10.0.0.1"))
                .isInstanceOfSatisfying(RateLimitedException.class,
                        ex -> assertThat(ex.retryAfterSeconds()).isEqualTo(1));
    }

    @Test
    void rejectsNewClientsWhileTrackingIsFullButKeepsCountingKnownOnes() {
        SaveRateLimiter small = new SaveRateLimiter(10, 2, clock);
        small.acquire("10.0.0.1");
        clock.advance(Duration.ofSeconds(20));
        small.acquire("10.0.0.2");
        clock.advance(Duration.ofSeconds(10));

        assertThatThrownBy(() -> small.acquire("10.0.0.3"))
                .isInstanceOfSatisfying(RateLimitedException.class, ex -> {
                    assertThat(ex.errorCode()).isEqualTo(ErrorCode.RATE_LIMITED);
                    assertThat(ex.retryAfterSeconds()).isEqualTo(30);
                });
        assertThatCode(() -> small.acquire("10.0.0.1")).doesNotThrowAnyException();
        assertThat(small.trackedClients()).isEqualTo(2);
    }

    @Test
    void freesExpiredClientsBeforeRejectingANewOne() {
        SaveRateLimiter small = new SaveRateLimiter(10, 2, clock);
        small.acquire("10.0.0.1");
        small.acquire("10.0.0.2");
        clock.advance(Duration.ofSeconds(60));

        assertThatCode(() -> small.acquire("10.0.0.3")).doesNotThrowAnyException();
        assertThat(small.trackedClients()).isEqualTo(1);
    }

    @Test
    void neverTracksMoreClientsThanTheCap() {
        SaveRateLimiter small = new SaveRateLimiter(10, 50, clock);
        for (int client = 0; client < 500; client++) {
            try {
                small.acquire("10.0.1." + client);
            } catch (RateLimitedException ignored) {
                assertThat(client).isGreaterThanOrEqualTo(50);
            }
        }

        assertThat(small.trackedClients()).isEqualTo(50);
    }

    @Test
    void rejectsAnEmptyTrackingCap() {
        assertThatThrownBy(() -> new SaveRateLimiter(10, 0, clock))
                .isInstanceOf(IllegalArgumentException.class);
    }

    private static final class MutableClock extends Clock {

        private Instant now;

        MutableClock(Instant now) {
            this.now = now;
        }

        void advance(Duration duration) {
            now = now.plus(duration);
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return now;
        }
    }
}
