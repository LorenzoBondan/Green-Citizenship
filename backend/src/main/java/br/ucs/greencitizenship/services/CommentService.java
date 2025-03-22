package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.comment.CommentDTO;
import br.ucs.greencitizenship.dtos.comment.CommentDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Comment;
import br.ucs.greencitizenship.repositories.CommentRepository;
import br.ucs.greencitizenship.services.exceptions.DataBaseException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository repository;
    private final CommentDtoToEntityAdapter adapter;
    private final AuthService authService;

    public CommentDTO findById(Integer id){
        Comment entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Comment Id not found: " + id));
        return adapter.toDto(entity);
    }

    public CommentDTO insert(CommentDTO dto){
        Comment entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public CommentDTO update(CommentDTO dto){
        if(!repository.existsById(dto.getId())){
            throw new ResourceNotFoundException("Id not found: " + dto.getId());
        }
        authService.validateSelfOrAdmin(findById(dto.getId()).getUser().getId());
        Comment entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public void delete(Integer id){
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Id not found: " + id);
        }
        try{
            authService.validateSelfOrAdmin(findById(id).getUser().getId());
            repository.deleteById(id);
        } catch(DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }
}
