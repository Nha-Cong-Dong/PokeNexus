package com.pokenexus.common.web;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Set;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.pokenexus.common.exception.ApiException;
import com.pokenexus.common.exception.ErrorCode;

@Component
public class RequestBodyLimitFilter extends OncePerRequestFilter {

    public static final int MAX_BODY_BYTES = 16 * 1024;

    private static final Set<String> BODY_METHODS = Set.of("POST", "PUT", "PATCH");

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !BODY_METHODS.contains(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        byte[] body = null;
        if (request.getContentLengthLong() <= MAX_BODY_BYTES) {
            byte[] read = request.getInputStream().readNBytes(MAX_BODY_BYTES + 1);
            body = read.length <= MAX_BODY_BYTES ? read : null;
        }
        chain.doFilter(new LimitedBodyRequest(request, body), response);
    }

    private static final class LimitedBodyRequest extends HttpServletRequestWrapper {

        private final byte[] body;

        LimitedBodyRequest(HttpServletRequest request, byte[] body) {
            super(request);
            this.body = body;
        }

        @Override
        public ServletInputStream getInputStream() {
            ByteArrayInputStream source = new ByteArrayInputStream(requireBody());
            return new ServletInputStream() {
                @Override
                public int read() {
                    return source.read();
                }

                @Override
                public int read(byte[] buffer, int offset, int length) {
                    return source.read(buffer, offset, length);
                }

                @Override
                public boolean isFinished() {
                    return source.available() == 0;
                }

                @Override
                public boolean isReady() {
                    return true;
                }

                @Override
                public void setReadListener(ReadListener listener) {
                    throw new UnsupportedOperationException("Async reads are not supported");
                }
            };
        }

        @Override
        public BufferedReader getReader() {
            String encoding = getCharacterEncoding();
            Charset charset = encoding != null ? Charset.forName(encoding) : StandardCharsets.UTF_8;
            return new BufferedReader(new InputStreamReader(getInputStream(), charset));
        }

        @Override
        public int getContentLength() {
            return body != null ? body.length : super.getContentLength();
        }

        @Override
        public long getContentLengthLong() {
            return body != null ? body.length : super.getContentLengthLong();
        }

        private byte[] requireBody() {
            if (body == null) {
                throw new ApiException(ErrorCode.PAYLOAD_TOO_LARGE,
                        "Request body must not exceed " + MAX_BODY_BYTES + " bytes");
            }
            return body;
        }
    }
}
