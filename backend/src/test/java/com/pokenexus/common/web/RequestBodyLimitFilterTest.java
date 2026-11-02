package com.pokenexus.common.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.charset.StandardCharsets;

import jakarta.servlet.ServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;

class RequestBodyLimitFilterTest {

    private final RequestBodyLimitFilter filter = new RequestBodyLimitFilter();

    @Test
    void refusesToHandOverOversizedBodyEvenWhenTheClientSendsNoContentLength() throws Exception {
        ServletRequest passed = filter(chunkedPost(new byte[RequestBodyLimitFilter.MAX_BODY_BYTES + 1]));

        assertThatThrownBy(passed::getInputStream)
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.errorCode()).isEqualTo(ErrorCode.PAYLOAD_TOO_LARGE));
        assertThatThrownBy(passed::getReader).isInstanceOf(ApiException.class);
    }

    @Test
    void refusesBodyWhoseDeclaredLengthIsTooLargeWithoutReadingIt() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/teams");
        request.setContent(new byte[RequestBodyLimitFilter.MAX_BODY_BYTES + 1]);

        ServletRequest passed = filter(request);

        assertThatThrownBy(passed::getInputStream).isInstanceOf(ApiException.class);
    }

    @Test
    void passesBodyAtTheLimitThroughUnchanged() throws Exception {
        byte[] body = "{\"pokemonIds\":[6,130]}".getBytes(StandardCharsets.UTF_8);
        ServletRequest passed = filter(chunkedPost(body));

        assertThat(passed.getInputStream().readAllBytes()).isEqualTo(body);
        assertThat(passed.getContentLengthLong()).isEqualTo(body.length);
        assertThat(filter(chunkedPost(new byte[RequestBodyLimitFilter.MAX_BODY_BYTES]))
                .getInputStream().readAllBytes()).hasSize(RequestBodyLimitFilter.MAX_BODY_BYTES);
    }

    @Test
    void leavesRequestsWithoutBodyAlone() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/pokemon");

        assertThat(filter(request)).isSameAs(request);
    }

    private ServletRequest filter(MockHttpServletRequest request) throws Exception {
        MockFilterChain chain = new MockFilterChain();
        filter.doFilter(request, new MockHttpServletResponse(), chain);
        assertThat(chain.getRequest()).isNotNull();
        return chain.getRequest();
    }

    private static MockHttpServletRequest chunkedPost(byte[] content) {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/teams") {
            @Override
            public long getContentLengthLong() {
                return -1;
            }

            @Override
            public int getContentLength() {
                return -1;
            }
        };
        request.setContentType("application/json");
        request.setContent(content);
        return request;
    }
}
