package br.com.prefeitura.bomdestino.sig;

import br.com.prefeitura.bomdestino.sig.exception.SMGException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ExceptionHandler extends ResponseEntityExceptionHandler {


    @org.springframework.web.bind.annotation.ExceptionHandler({ SMGException.class })
    public ResponseEntity<Object> handleSGMException(SMGException ex, WebRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST.value()).body(ex);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        FieldError fieldError = ex.getBindingResult().getFieldError();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new SMGException(ex.getMessage(), fieldError.getDefaultMessage()));
    }

}
