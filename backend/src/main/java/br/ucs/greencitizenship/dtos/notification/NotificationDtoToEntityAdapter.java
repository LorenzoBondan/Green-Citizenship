package br.ucs.greencitizenship.dtos.notification;

import br.ucs.greencitizenship.dtos.Convertable;
import br.ucs.greencitizenship.dtos.user.UserDTO;
import br.ucs.greencitizenship.entities.Notification;
import br.ucs.greencitizenship.entities.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class NotificationDtoToEntityAdapter implements Convertable<Notification, NotificationDTO> {

    @Override
    public Notification toEntity(NotificationDTO dto) {
        return Notification.builder()
                .id(dto.getId())
                .user(new User(dto.getUser().getId()))
                .text(dto.getText())
                .date(dto.getDate())
                .isRead(dto.getIsRead())
                .build();
    }

    @Override
    public NotificationDTO toDto(Notification entity) {
        return NotificationDTO.builder()
                .id(entity.getId())
                .user(Optional.ofNullable(entity.getUser())
                        .map(user -> new UserDTO(user.getId()))
                        .orElse(null))
                .text(entity.getText())
                .date(Optional.ofNullable(entity.getDate()).orElse(LocalDateTime.now()))
                .isRead(Optional.ofNullable(entity.getIsRead()).orElse(Boolean.FALSE))
                .build();
    }
}
