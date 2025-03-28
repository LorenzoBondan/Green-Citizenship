package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.postattachment.PostAttachmentDTO;
import br.ucs.greencitizenship.dtos.postattachment.PostAttachmentDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.PostAttachment;
import br.ucs.greencitizenship.repositories.PostAttachmentRepository;
import br.ucs.greencitizenship.services.exceptions.DataBaseException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostAttachmentService {

    private final PostAttachmentRepository repository;
    private final PostAttachmentDtoToEntityAdapter adapter;
    private final AuthService authService;

    public PostAttachmentDTO findById(Integer id){
        PostAttachment entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("PostAttachment Id not found: " + id));
        return adapter.toDto(entity);
    }

    public PostAttachmentDTO insert(PostAttachmentDTO dto){
        authService.validateSelfOrAdmin(findById(dto.getId()).getPost().getAuthor().getId());
        PostAttachment entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public PostAttachmentDTO update(PostAttachmentDTO dto){
        authService.validateSelfOrAdmin(findById(dto.getId()).getPost().getAuthor().getId());
        if(!repository.existsById(dto.getId())){
            throw new ResourceNotFoundException("Id not found: " + dto.getId());
        }
        PostAttachment entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public void delete(Integer id){
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Id not found: " + id);
        }
        try{
            authService.validateSelfOrAdmin(findById(id).getPost().getAuthor().getId());
            repository.deleteById(id);
        } catch(DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }
}
