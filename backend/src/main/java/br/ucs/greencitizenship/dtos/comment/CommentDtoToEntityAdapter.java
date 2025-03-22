package br.ucs.greencitizenship.dtos.comment;

import br.ucs.greencitizenship.dtos.Convertable;
import br.ucs.greencitizenship.dtos.like.LikeDTO;
import br.ucs.greencitizenship.dtos.like.LikeDtoToEntityAdapter;
import br.ucs.greencitizenship.dtos.post.PostDTO;
import br.ucs.greencitizenship.dtos.user.UserDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Comment;
import br.ucs.greencitizenship.entities.Post;
import br.ucs.greencitizenship.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CommentDtoToEntityAdapter implements Convertable<Comment, CommentDTO> {

    private final UserDtoToEntityAdapter userDtoToEntityAdapter;
    private final LikeDtoToEntityAdapter likeDtoToEntityAdapter;

    @Override
    public Comment toEntity(CommentDTO dto) {
        return Comment.builder()
                .id(dto.getId())
                .user(new User(dto.getUser().getId()))
                .post(new Post(dto.getPost().getId()))
                .text(dto.getText())
                .date(dto.getDate())
                .build();
    }

    @Override
    public CommentDTO toDto(Comment entity) {

        List<LikeDTO> likes = Optional.ofNullable(entity.getLikes())
                .map(list -> list.stream()
                        .map(likeDtoToEntityAdapter::toDto)
                        .toList())
                .orElse(List.of());

        return CommentDTO.builder()
                .id(entity.getId())
                .user(Optional.ofNullable(entity.getUser())
                        .map(userDtoToEntityAdapter::toDto)
                        .orElse(null))
                .post(Optional.ofNullable(entity.getPost())
                        .map(post -> new PostDTO(post.getId()))
                        .orElse(null))
                .text(entity.getText())
                .date(entity.getDate())

                .likes(likes)

                .build();
    }
}
