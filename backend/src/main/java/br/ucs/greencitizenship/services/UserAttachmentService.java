package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.userattachment.UserAttachmentDTO;
import br.ucs.greencitizenship.dtos.userattachment.UserAttachmentDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.UserAttachment;
import br.ucs.greencitizenship.repositories.UserAttachmentRepository;
import br.ucs.greencitizenship.services.exceptions.DataBaseException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserAttachmentService {

    private final UserAttachmentRepository repository;
    private final UserAttachmentDtoToEntityAdapter adapter;
    private final AuthService authService;

    public UserAttachmentDTO findById(Integer id){
        UserAttachment entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("UserAttachment Id not found: " + id));
        return adapter.toDto(entity);
    }

    public UserAttachmentDTO insert(UserAttachmentDTO dto){
        authService.validateSelfOrAdmin(dto.getUser().getId());
        UserAttachment entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public UserAttachmentDTO update(UserAttachmentDTO dto){
        authService.validateSelfOrAdmin(dto.getUser().getId());
        if(!repository.existsById(dto.getId())){
            throw new ResourceNotFoundException("Id not found: " + dto.getId());
        }
        UserAttachment entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public void delete(Integer id){
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Id not found: " + id);
        }
        try{
            authService.validateSelfOrAdmin(findById(id).getId());
            repository.deleteById(id);
        } catch(DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }
}
