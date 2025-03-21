package br.ucs.greencitizenship.dtos.handlers;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FieldMessageDTO {

    private String fieldName;
    private String message;
}
