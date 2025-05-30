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
    private final AuthService authService;

    public Page<NotificationDTO> findAllByUserId(Integer userId, Pageable pageable){
        authService.validateSelfOrAdmin(userId);
        Page<Notification> list = repository.findByUserId(userId, pageable);
        return list.map(adapter::toDto);
    }

    public NotificationDTO insert(NotificationDTO dto){
        Notification entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public void updateIsRead(Integer notificationId){
        Notification entity = repository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Id not found: " + notificationId));
        authService.validateSelfOrAdmin(entity.getUser().getId());
        entity.setIsRead(!entity.getIsRead());
        repository.save(entity);
    }
}
