package br.ucs.greencitizenship.dtos.post;

import br.ucs.greencitizenship.dtos.Convertable;
import br.ucs.greencitizenship.dtos.category.CategoryDtoToEntityAdapter;
import br.ucs.greencitizenship.dtos.comment.CommentDTO;
import br.ucs.greencitizenship.dtos.comment.CommentDtoToEntityAdapter;
import br.ucs.greencitizenship.dtos.enums.StatusEnumDTO;
import br.ucs.greencitizenship.dtos.like.LikeDTO;
import br.ucs.greencitizenship.dtos.like.LikeDtoToEntityAdapter;
import br.ucs.greencitizenship.dtos.user.UserDTO;
import br.ucs.greencitizenship.dtos.user.UserDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Category;
import br.ucs.greencitizenship.entities.Post;
import br.ucs.greencitizenship.entities.User;
import br.ucs.greencitizenship.entities.enums.StatusEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PostDtoToEntityAdapter implements Convertable<Post, PostDTO> {

    private final UserDtoToEntityAdapter userDtoToEntityAdapter;
    private final CategoryDtoToEntityAdapter categoryDtoToEntityAdapter;
    private final LikeDtoToEntityAdapter likeDtoToEntityAdapter;
    private final CommentDtoToEntityAdapter commentDtoToEntityAdapter;

    @Override
    public Post toEntity(PostDTO dto) {
        return Post.builder()
                .id(dto.getId())
                .author(new User(dto.getAuthor().getId()))
                .category(new Category(dto.getCategory().getId()))
                .title(dto.getTitle())
                .description(dto.getDescription())
                .date(dto.getDate())
                .status(StatusEnum.valueOf(dto.getStatus().name()))
                .isUrgent(dto.getIsUrgent())
                .build();
    }

    @Override
    public PostDTO toDto(Post entity) {

        List<LikeDTO> likes = Optional.ofNullable(entity.getLikes())
                .map(list -> list.stream()
                        .map(likeDtoToEntityAdapter::toDto)
                        .toList())
                .orElse(List.of());

        List<CommentDTO> comments = Optional.ofNullable(entity.getComments())
                .map(list -> list.stream()
                        .map(commentDtoToEntityAdapter::toDto)
                        .toList())
                .orElse(List.of());

        return PostDTO.builder()
                .id(entity.getId())
                .author(Optional.ofNullable(entity.getAuthor())
                        .map(userDtoToEntityAdapter::toDto)
                        .orElse(null))
                .category(Optional.ofNullable(entity.getCategory())
                        .map(categoryDtoToEntityAdapter::toDto)
                        .orElse(null))
                .title(entity.getTitle())
                .description(entity.getDescription())
                .date(Optional.ofNullable(entity.getDate()).orElse(LocalDateTime.now()))
                .status(Optional.ofNullable(entity.getStatus())
                        .map(statusEnum -> StatusEnumDTO.valueOf(statusEnum.name()))
                        .orElse(null))
                .isUrgent(Optional.ofNullable(entity.getIsUrgent()).orElse(Boolean.FALSE))

                .likes(likes)
                .comments(comments)

                .build();
    }
}
