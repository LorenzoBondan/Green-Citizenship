package br.ucs.greencitizenship.dtos.user;

import br.ucs.greencitizenship.dtos.role.RoleDTO;
import br.ucs.greencitizenship.dtos.Convertable;
import br.ucs.greencitizenship.entities.Role;
import br.ucs.greencitizenship.entities.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserDtoToEntityAdapter implements Convertable<User, UserDTO> {

    @Override
    public User toEntity(UserDTO dto) {
        return User.builder()
                .id(dto.getId())
                .name(dto.getName())
                .password(dto.getPassword())
                .email(dto.getEmail())

                .roles(dto.getRoles().stream().map(role -> new Role(role.getId(), role.getAuthority())).collect(Collectors.toSet()))

                .build();
    }

    @Override
    public UserDTO toDto(User entity) {
        return UserDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .password(entity.getPassword())
                .email(entity.getEmail())

                .roles(entity.getRoles().stream().map(role -> new RoleDTO(role.getId(), role.getAuthority())).collect(Collectors.toList()))

                .build();
    }
}
