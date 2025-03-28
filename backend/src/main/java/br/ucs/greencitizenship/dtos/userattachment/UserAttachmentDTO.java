package br.ucs.greencitizenship.dtos.userattachment;

import br.ucs.greencitizenship.dtos.attachment.AttachmentDTO;
import br.ucs.greencitizenship.dtos.user.UserDTO;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class UserAttachmentDTO {

    private Integer id;
    @NotNull
    private UserDTO user;
    @NotNull
    private AttachmentDTO attachment;

    public UserAttachmentDTO(Integer id) {
        this.id = id;
    }
}
