package br.ucs.greencitizenship.dtos.like;

import br.ucs.greencitizenship.dtos.Convertable;
import br.ucs.greencitizenship.dtos.post.PostDTO;
import br.ucs.greencitizenship.dtos.user.UserDTO;
import br.ucs.greencitizenship.dtos.user.UserDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Like;
import br.ucs.greencitizenship.entities.Post;
import br.ucs.greencitizenship.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class LikeDtoToEntityAdapter implements Convertable<Like, LikeDTO> {

    private final UserDtoToEntityAdapter userDtoToEntityAdapter;

    @Override
    public Like toEntity(LikeDTO dto) {
        return Like.builder()
                .id(dto.getId())
                .user(new User(dto.getUser().getId()))
                .post(Optional.ofNullable(dto.getPost())
                        .map(post -> new Post(post.getId()))
                        .orElse(null))
                /*.comment(Optional.ofNullable(dto.getComment())
                        .map(comment -> new Comment(comment.getId()))
                        .orElse(null))*/
                .build();
    }

    @Override
    public LikeDTO toDto(Like entity) {
        return LikeDTO.builder()
                .id(entity.getId())
                .user(Optional.ofNullable(entity.getUser())
                        .map(userDtoToEntityAdapter::toDto)
                        .orElse(null))
                .post(Optional.ofNullable(entity.getPost())
                        .map(post -> new PostDTO(post.getId()))
                        .orElse(null))
                /*.comment(Optional.ofNullable(entity.getComment())
                        .map(comment -> new CommentDTO(comment.getId()))
                        .orElse(null))*/
                .build();
    }
}
