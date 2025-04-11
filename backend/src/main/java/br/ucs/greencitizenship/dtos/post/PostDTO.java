package br.ucs.greencitizenship.dtos.post;

import br.ucs.greencitizenship.dtos.category.CategoryDTO;
import br.ucs.greencitizenship.dtos.comment.CommentDTO;
import br.ucs.greencitizenship.dtos.enums.StatusEnumDTO;
import br.ucs.greencitizenship.dtos.like.LikeDTO;
import br.ucs.greencitizenship.dtos.postattachment.PostAttachmentDTO;
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
public class PostDTO {

    private Integer id;
    @NotNull
    private UserDTO author;
    @NotNull
    private CategoryDTO category;
    @NotBlank
    @Size(max = 50)
    private String title;
    @NotBlank
    @Size(max = 500)
    private String description;
    private LocalDateTime date = LocalDateTime.now();
    private StatusEnumDTO status;
    private Boolean isUrgent = Boolean.FALSE;
    private PostAttachmentDTO postAttachment;

    private List<LikeDTO> likes = new ArrayList<>();
    private List<CommentDTO> comments = new ArrayList<>();

    public PostDTO(Integer id) {
        this.id = id;
    }
}
