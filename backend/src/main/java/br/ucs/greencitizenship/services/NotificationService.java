package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.notification.NotificationDTO;
import br.ucs.greencitizenship.dtos.notification.NotificationDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Notification;
import br.ucs.greencitizenship.repositories.NotificationRepository;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;
    private final NotificationDtoToEntityAdapter adapter;

    public Page<NotificationDTO> findAllByUserId(Pageable pageable, Integer userId){
        Page<Notification> list = repository.findByUserId(pageable, userId);
        return list.map(adapter::toDto);
    }

    public NotificationDTO insert(NotificationDTO dto){
        Notification entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public NotificationDTO updateIsRead(Integer notificationId, Boolean isRead){
        Notification entity = repository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Id not found: " + notificationId));
        entity.setIsRead(isRead);
        repository.save(entity);
        return adapter.toDto(entity);
    }
}
