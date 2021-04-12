package br.com.prefeitura.bomdestino.sig.web.rest.errors;

import org.zalando.problem.Status;
import org.zalando.problem.ThrowableProblem;

import javax.annotation.Nullable;
import java.net.URI;

public class AlertException extends ThrowableProblem {

    private final URI alertType;
    private final String alertMessage;
    private final Status alertStatus;

    public AlertException(Builder builder) {
        this.alertType = builder.type;
        this.alertMessage = builder.message;
        this.alertStatus = builder.status;
    }

    public static AlertException emailNotFoundException() {
        return new Builder()
                .withType(ErrorConstants.EMAIL_NOT_FOUND_TYPE)
                .withMessage(ErrorConstants.EMAIL_NOT_FOUND_MESSAGE)
                .withStatus(Status.BAD_REQUEST)
                .build();
    }

    public static AlertException invalidPasswordException() {
        return new Builder()
                .withType(ErrorConstants.INVALID_PASSWORD_TYPE)
                .withMessage(ErrorConstants.INVALID_PASS_MESSAGE)
                .withStatus(Status.BAD_REQUEST)
                .build();
    }

    public static BadRequestAlertException emailAlreadyUsedException() {
        return new BadRequestAlertException(
                ErrorConstants.EMAIL_ALREADY_USED_TYPE,
                "Email is already in use!",
                "userManagement",
                "emailexists");
    }

    public static BadRequestAlertException loginAlreadyUsedException() {
        return new BadRequestAlertException(
                ErrorConstants.LOGIN_ALREADY_USED_TYPE,
                "Login name already used!",
                "userManagement",
                "userexists");
    }

    public static BadRequestAlertException profileAlreadyUsedException() {
        return new BadRequestAlertException(
                ErrorConstants.PROFILE_NAME_ALREADY_USED_TYPE,
                "There is already a Profile registered with this name",
                "profileManagement",
                "profilenameexists");
    }

    @Override
    public URI getType() {
        return this.alertType;
    }

    @Override
    public String getMessage() {
        return this.alertMessage;
    }

    @Nullable
    @Override
    public Status getStatus() {
        return this.alertStatus;
    }

    public static class Builder {
        private URI type;
        private String message;
        private Status status;

        public AlertException build() {
            return new AlertException(this);
        }

        public Builder withType(URI type) {
            this.type = type;
            return this;
        }

        public Builder withMessage(String message) {
            this.message = message;
            return this;
        }

        public Builder withStatus(Status status) {
            this.status = status;
            return this;
        }
    }
}
