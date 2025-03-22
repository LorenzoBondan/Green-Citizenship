package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.like.LikeDTO;
import br.ucs.greencitizenship.dtos.like.LikeDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Like;
import br.ucs.greencitizenship.repositories.LikeRepository;
import br.ucs.greencitizenship.services.exceptions.DataBaseException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository repository;
    private final LikeDtoToEntityAdapter adapter;
    private final AuthService authService;

    public LikeDTO findById(Integer id){
        Like entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Like Id not found: " + id));
        return adapter.toDto(entity);
    }

    public LikeDTO insert(LikeDTO dto){
        Like entity = adapter.toEntity(dto);
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
