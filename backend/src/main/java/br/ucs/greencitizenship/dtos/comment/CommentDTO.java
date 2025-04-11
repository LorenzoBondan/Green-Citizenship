package br.ucs.greencitizenship.dtos.comment;

import br.ucs.greencitizenship.dtos.like.LikeDTO;
import br.ucs.greencitizenship.dtos.post.PostDTO;
import br.ucs.greencitizenship.dtos.user.UserDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
public class CommentDTO {

    private Integer id;
    @NotNull
    private UserDTO user;
    @NotNull
    private PostDTO post;
    @NotBlank
    @Size(max = 300)
    private String text;
    private LocalDateTime date = LocalDateTime.now();

    private List<LikeDTO> likes = new ArrayList<>();

    public CommentDTO(Integer id) {
        this.id = id;
    }
}
