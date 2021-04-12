package br.com.prefeitura.bomdestino.sig.web.rest.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AdminCannotBeEditedException extends RuntimeException {

    public AdminCannotBeEditedException(String message) {
        super(message);
    }
}
