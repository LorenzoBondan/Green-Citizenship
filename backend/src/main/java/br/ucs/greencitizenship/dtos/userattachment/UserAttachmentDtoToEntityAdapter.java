package br.ucs.greencitizenship.dtos.userattachment;

import br.ucs.greencitizenship.dtos.Convertable;
import br.ucs.greencitizenship.dtos.attachment.AttachmentDtoToEntityAdapter;
import br.ucs.greencitizenship.dtos.user.UserDTO;
import br.ucs.greencitizenship.entities.Attachment;
import br.ucs.greencitizenship.entities.User;
import br.ucs.greencitizenship.entities.UserAttachment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserAttachmentDtoToEntityAdapter implements Convertable<UserAttachment, UserAttachmentDTO> {

    @Autowired
    private AttachmentDtoToEntityAdapter attachmentDtoToEntityAdapter;

    @Override
    public UserAttachment toEntity(UserAttachmentDTO dto) {
        return UserAttachment.builder()
                .id(dto.getId())
                .user(new User(dto.getUser().getId()))
                .attachment(new Attachment(dto.getAttachment().getId()))
                .build();
    }

    @Override
    public UserAttachmentDTO toDto(UserAttachment entity) {
        return UserAttachmentDTO.builder()
                .id(entity.getId())
                .user(Optional.ofNullable(entity.getUser())
                        .map(User -> new UserDTO(User.getId()))
                        .orElse(null))
                .attachment(Optional.ofNullable(entity.getAttachment())
                        .map(attachmentDtoToEntityAdapter::toDto)
                        .orElse(null))
                .build();
    }
}
