package com.pokenexus.common.exception;

import java.util.List;
import java.util.stream.Stream;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    public static final String CODE_PROPERTY = "code";
    public static final String ERRORS_PROPERTY = "errors";

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ProblemDetail> handleApiException(ApiException ex, HttpServletRequest request) {
        ErrorCode errorCode = ex.errorCode();
        log.debug("API error {} on {}: {}", errorCode, request.getRequestURI(), ex.getMessage());
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(errorCode.status(), ex.getMessage());
        problem.setProperty(CODE_PROPERTY, errorCode.name());
        ResponseEntity.BodyBuilder response = ResponseEntity.status(errorCode.status());
        if (ex instanceof RateLimitedException rateLimited) {
            response.header(HttpHeaders.RETRY_AFTER, Long.toString(rateLimited.retryAfterSeconds()));
        }
        return response.body(problem);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error on {} {}", request.getMethod(), request.getRequestURI(), ex);
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error");
        problem.setProperty(CODE_PROPERTY, ErrorCode.INTERNAL_ERROR.name());
        return ResponseEntity.internalServerError().body(problem);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        ProblemDetail problem = ex.getBody();
        problem.setDetail("Request validation failed");
        problem.setProperty(ERRORS_PROPERTY, toViolations(ex));
        return handleExceptionInternal(ex, problem, headers, status, request);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception ex, Object body, HttpHeaders headers, HttpStatusCode statusCode, WebRequest request) {
        ResponseEntity<Object> response = super.handleExceptionInternal(ex, body, headers, statusCode, request);
        if (response != null && response.getBody() instanceof ProblemDetail problem) {
            problem.setProperty(CODE_PROPERTY, resolveCode(ex, statusCode).name());
        }
        if (statusCode.is5xxServerError()) {
            log.error("Framework error on {}", request.getDescription(false), ex);
        } else {
            log.debug("Client error on {}: {}", request.getDescription(false), ex.getMessage());
        }
        return response;
    }

    private static ErrorCode resolveCode(Exception ex, HttpStatusCode statusCode) {
        return switch (ex) {
            case MethodArgumentNotValidException _ -> ErrorCode.VALIDATION_FAILED;
            case HandlerMethodValidationException validation when isRequestBody(validation) ->
                    ErrorCode.VALIDATION_FAILED;
            case HttpMessageNotReadableException _ -> ErrorCode.MALFORMED_JSON;
            case NoResourceFoundException _, NoHandlerFoundException _ -> ErrorCode.ROUTE_NOT_FOUND;
            default -> fallbackCode(statusCode);
        };
    }

    private static ErrorCode fallbackCode(HttpStatusCode statusCode) {
        if (statusCode.is5xxServerError()) {
            return ErrorCode.INTERNAL_ERROR;
        }
        if (statusCode.value() == HttpStatus.NOT_FOUND.value()) {
            return ErrorCode.ROUTE_NOT_FOUND;
        }
        return ErrorCode.INVALID_PARAMETER;
    }

    private static boolean isRequestBody(HandlerMethodValidationException ex) {
        return ex.getParameterValidationResults().stream()
                .anyMatch(result -> result.getMethodParameter().hasParameterAnnotation(RequestBody.class));
    }

    private static List<FieldViolation> toViolations(MethodArgumentNotValidException ex) {
        Stream<FieldViolation> fieldViolations = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> new FieldViolation(error.getField(), messageOf(error)));
        Stream<FieldViolation> globalViolations = ex.getBindingResult().getGlobalErrors().stream()
                .map(error -> new FieldViolation(error.getObjectName(), error.getDefaultMessage()));
        return Stream.concat(fieldViolations, globalViolations).toList();
    }

    private static String messageOf(FieldError error) {
        return error.getDefaultMessage() != null ? error.getDefaultMessage() : "invalid value";
    }

    public record FieldViolation(String field, String message) {
    }
}
