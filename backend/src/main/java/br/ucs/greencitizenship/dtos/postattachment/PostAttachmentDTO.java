package br.ucs.greencitizenship.dtos.postattachment;

import br.ucs.greencitizenship.dtos.attachment.AttachmentDTO;
import br.ucs.greencitizenship.dtos.post.PostDTO;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class PostAttachmentDTO {

    private Integer id;
    @NotNull
    private PostDTO post;
    @NotNull
    private AttachmentDTO attachment;

    public PostAttachmentDTO(Integer id) {
        this.id = id;
    }
}
