package com.pokenexus.common.exception;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;

import org.junit.jupiter.api.Test;

class NotFoundExceptionTest {

    @Test
    void keepsNotFoundCodeAndDetail() {
        NotFoundException ex = new NotFoundException(ErrorCode.TEAM_NOT_FOUND, "Team 'abc12345' not found");

        assertThat(ex.errorCode()).isEqualTo(ErrorCode.TEAM_NOT_FOUND);
        assertThat(ex.getMessage()).isEqualTo("Team 'abc12345' not found");
    }

    @Test
    void rejectsCodeThatIsNotNotFound() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> new NotFoundException(ErrorCode.VALIDATION_FAILED, "wrong"));
    }

    @Test
    void rejectsNullCode() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> new NotFoundException(null, "wrong"));
    }
}
