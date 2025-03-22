package br.ucs.greencitizenship.dtos.binary;

import br.ucs.greencitizenship.dtos.Convertable;
import br.ucs.greencitizenship.entities.Binary;
import org.springframework.stereotype.Component;

@Component
public class BinaryDtoToEntityAdapter implements Convertable<Binary, BinaryDTO> {

    @Override
    public Binary toEntity(BinaryDTO dto) {
        return Binary.builder()
                .id(dto.getId())
                .bytes(dto.getBytes())
                .build();
    }

    @Override
    public BinaryDTO toDto(Binary entity) {
        return BinaryDTO.builder()
                .id(entity.getId())
                .bytes(entity.getBytes())
                .build();
    }
}
