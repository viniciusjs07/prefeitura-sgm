package br.com.prefeitura.bomdestino.sig.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidParentException extends RuntimeException {

    private static final long serialVersionUID = -8496168025698600318L;

    public InvalidParentException(String message) {
        super(message);
    }

}
