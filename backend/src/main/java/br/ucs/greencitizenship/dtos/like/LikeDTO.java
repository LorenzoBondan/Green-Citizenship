package br.ucs.greencitizenship.dtos.like;

import br.ucs.greencitizenship.dtos.comment.CommentDTO;
import br.ucs.greencitizenship.dtos.post.PostDTO;
import br.ucs.greencitizenship.dtos.user.UserDTO;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class LikeDTO {

    private Integer id;
    @NotNull
    private UserDTO user;
    private PostDTO post;
    private CommentDTO comment;

    public LikeDTO(Integer id) {
        this.id = id;
    }
}
