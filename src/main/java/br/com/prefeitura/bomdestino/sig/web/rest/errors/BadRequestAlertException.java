package br.com.prefeitura.bomdestino.sig.web.rest.errors;

import org.zalando.problem.Status;
import org.zalando.problem.ThrowableProblem;

import javax.annotation.Nullable;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

public class BadRequestAlertException extends ThrowableProblem {

    private final String entityName;
    private final String errorKey;
    private final URI type;
    private final String message;
    private final Status status;
    private final transient Map<String, Object> parameters;

    public BadRequestAlertException(String defaultMessage, String entityName, String errorKey) {
        this(ErrorConstants.DEFAULT_TYPE, defaultMessage, entityName, errorKey);
    }

    public BadRequestAlertException(URI type, String defaultMessage, String entityName, String errorKey) {
        this.type = type;
        this.message = defaultMessage;
        this.status = Status.BAD_REQUEST;
        this.parameters = getAlertParameters(entityName, errorKey);
        this.entityName = entityName;
        this.errorKey = errorKey;
    }

    private static Map<String, Object> getAlertParameters(String entityName, String errorKey) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("message", "error." + errorKey);
        parameters.put("params", entityName);
        return parameters;
    }

    public String getEntityName() {
        return entityName;
    }

    public String getErrorKey() {
        return errorKey;
    }

    @Override
    public URI getType() {
        return this.type;
    }

    @Override
    public String getMessage() {
        return this.message;
    }

    @Nullable
    @Override
    public Status getStatus() {
        return this.status;
    }

    @Override
    public Map<String, Object> getParameters() {
        return this.parameters;
    }
}
