package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.attachment.AttachmentDTO;
import br.ucs.greencitizenship.dtos.attachment.AttachmentDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Attachment;
import br.ucs.greencitizenship.repositories.AttachmentRepository;
import br.ucs.greencitizenship.services.exceptions.DataBaseException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository repository;
    private final AttachmentDtoToEntityAdapter adapter;

    public AttachmentDTO findById(Integer id){
        Attachment entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Attachment Id not found: " + id));
        return adapter.toDto(entity);
    }

    public AttachmentDTO insert(AttachmentDTO dto){
        Attachment entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public AttachmentDTO update(AttachmentDTO dto){
        if(!repository.existsById(dto.getId())){
            throw new ResourceNotFoundException("Id not found: " + dto.getId());
        }
        Attachment entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public void delete(Integer id){
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Id not found: " + id);
        }
        try{
            repository.deleteById(id);
        } catch(DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }
}
