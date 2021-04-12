package br.com.prefeitura.bomdestino.sig.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SMGException extends RuntimeException {

    private final String translate;

    public SMGException(String message) {
        super(message);
        this.translate =  null;
    }

    public SMGException(String message, String translate) {
        super(message);
        this.translate =  translate;
    }

    public String getTranslate() {
        return translate;
    }
}
