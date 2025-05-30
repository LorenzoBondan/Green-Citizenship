package br.ucs.greencitizenship.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class InvalidDataException extends RuntimeException{

    @Serial
    private static final long serialVersionUID = 1L;
    public InvalidDataException(String msg){
        super(msg);
    }
}
