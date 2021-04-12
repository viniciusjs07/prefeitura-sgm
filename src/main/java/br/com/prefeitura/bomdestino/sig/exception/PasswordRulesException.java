package br.com.prefeitura.bomdestino.sig.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class PasswordRulesException extends RuntimeException {

    public PasswordRulesException(String message) {
        super(message);
    }

}
