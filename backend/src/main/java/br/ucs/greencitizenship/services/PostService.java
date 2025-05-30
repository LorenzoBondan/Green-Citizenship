package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.enums.StatusEnumDTO;
import br.ucs.greencitizenship.dtos.notification.NotificationDTO;
import br.ucs.greencitizenship.dtos.post.PostDTO;
import br.ucs.greencitizenship.dtos.post.PostDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Post;
import br.ucs.greencitizenship.repositories.PostRepository;
import br.ucs.greencitizenship.services.exceptions.DataBaseException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import jakarta.xml.bind.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository repository;
    private final PostDtoToEntityAdapter adapter;
    private final AuthService authService;
    private final NotificationService notificationService;

    public Page<PostDTO> findAllByTitleAndCategoryAndStatus(String title, Integer categoryId, List<Integer> statusId, Pageable pageable){
        Page<Post> list = repository.findByTitleAndCategoryAndStatus(title, categoryId, statusId, pageable);
        return list.map(adapter::toDto);
    }

    public PostDTO findById(Integer id){
        Post entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post Id not found: " + id));
        return adapter.toDto(entity);
    }

    public PostDTO insert(PostDTO dto){
        Post entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public PostDTO update(PostDTO dto){
        if(!repository.existsById(dto.getId())){
            throw new ResourceNotFoundException("Id not found: " + dto.getId());
        }
        authService.validateSelfOrAdmin(findById(dto.getId()).getAuthor().getId());
        Post entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public void updateStatus(Integer id, String status) throws ValidationException {
        StatusEnumDTO statusEnum;
        try {
            statusEnum = StatusEnumDTO.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Status inválido: " + status);
        }
        PostDTO post = findById(id);
        post.setStatus(statusEnum);
        repository.save(adapter.toEntity(post));

        notificationService.insert(NotificationDTO.builder()
                        .text("Sua publicação: " + post.getTitle() + " teve seu status alterado para: " + post.getStatus().getLabel())
                        .user(post.getAuthor())
                        .date(LocalDateTime.now())
                        .isRead(false)
                .build());
    }

    public void delete(Integer id){
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Id not found: " + id);
        }
        try{
            authService.validateSelfOrAdmin(findById(id).getAuthor().getId());
            repository.deleteById(id);
        } catch(DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }
}
