package br.ucs.greencitizenship.dtos.postattachment;

import br.ucs.greencitizenship.dtos.Convertable;
import br.ucs.greencitizenship.dtos.attachment.AttachmentDtoToEntityAdapter;
import br.ucs.greencitizenship.dtos.post.PostDTO;
import br.ucs.greencitizenship.entities.Attachment;
import br.ucs.greencitizenship.entities.Post;
import br.ucs.greencitizenship.entities.PostAttachment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class PostAttachmentDtoToEntityAdapter implements Convertable<PostAttachment, PostAttachmentDTO> {

    @Autowired
    private AttachmentDtoToEntityAdapter attachmentDtoToEntityAdapter;

    @Override
    public PostAttachment toEntity(PostAttachmentDTO dto) {
        return PostAttachment.builder()
                .id(dto.getId())
                .post(new Post(dto.getPost().getId()))
                .attachment(new Attachment(dto.getAttachment().getId()))
                .build();
    }

    @Override
    public PostAttachmentDTO toDto(PostAttachment entity) {
        return PostAttachmentDTO.builder()
                .id(entity.getId())
                .post(Optional.ofNullable(entity.getPost())
                        .map(post -> new PostDTO(post.getId()))
                        .orElse(null))
                .attachment(Optional.ofNullable(entity.getAttachment())
                        .map(attachmentDtoToEntityAdapter::toDto)
                        .orElse(null))
                .build();
    }
}
