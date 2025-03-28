package br.ucs.greencitizenship.dtos.attachment;

import br.ucs.greencitizenship.dtos.Convertable;
import br.ucs.greencitizenship.dtos.binary.BinaryDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Attachment;
import br.ucs.greencitizenship.entities.Binary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AttachmentDtoToEntityAdapter implements Convertable<Attachment, AttachmentDTO> {

    private final BinaryDtoToEntityAdapter binaryDtoToEntityAdapter;

    @Override
    public Attachment toEntity(AttachmentDTO dto) {
        return Attachment.builder()
                .id(dto.getId())
                .binary(new Binary(dto.getBinary().getId()))
                .name(dto.getName())
                .build();
    }

    @Override
    public AttachmentDTO toDto(Attachment entity) {

        return AttachmentDTO.builder()
                .id(entity.getId())
                .binary(Optional.ofNullable(entity.getBinary())
                        .map(binaryDtoToEntityAdapter::toDto)
                        .orElse(null))
                .name(entity.getName())
                .build();
    }
}
