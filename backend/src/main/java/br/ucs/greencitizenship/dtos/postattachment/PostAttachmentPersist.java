package br.ucs.greencitizenship.dtos.postattachment;

import br.ucs.greencitizenship.dtos.post.PostDTO;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PostAttachmentPersist {

    @EqualsAndHashCode.Include
    private Integer id;
    @NotNull
    private byte[] bytes;
    private String name;
    @NotNull
    private PostDTO post;
}
