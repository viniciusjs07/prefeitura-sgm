package br.com.prefeitura.bomdestino.sig.web.rest.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ElasticSearchInvalidException extends RuntimeException {

    public ElasticSearchInvalidException(String message) {
        super(message);
    }
}
