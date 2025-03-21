package br.ucs.greencitizenship.dtos.handlers;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class CustomErrorDTO {

    private Instant timestamp;
    private Integer status;
    private String error;
    private String path;
}
