package br.ucs.greencitizenship.dtos.attachment;

import br.ucs.greencitizenship.dtos.binary.BinaryDTO;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class AttachmentDTO {

    private Integer id;
    private BinaryDTO binary;
    private String name;

    public AttachmentDTO(Integer id) {
        this.id = id;
    }
}
