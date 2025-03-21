package br.ucs.greencitizenship.dtos.role;

import br.ucs.greencitizenship.dtos.Convertable;
import br.ucs.greencitizenship.entities.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleDtoToEntityAdapter implements Convertable<Role, RoleDTO> {

    @Override
    public Role toEntity(RoleDTO dto) {
        return Role.builder()
                .id(dto.getId())
                .authority(dto.getAuthority())
                .build();
    }

    @Override
    public RoleDTO toDto(Role entity) {
        return RoleDTO.builder()
                .id(entity.getId())
                .authority(entity.getAuthority())
                .build();
    }
}
