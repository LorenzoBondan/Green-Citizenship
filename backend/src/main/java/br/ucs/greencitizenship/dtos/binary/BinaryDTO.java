package br.ucs.greencitizenship.dtos.binary;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class BinaryDTO {

    private Integer id;
    private byte[] bytes;
}
