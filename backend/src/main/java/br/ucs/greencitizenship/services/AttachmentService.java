package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.binary.BinaryDTO;
import br.ucs.greencitizenship.dtos.binary.BinaryDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Binary;
import br.ucs.greencitizenship.repositories.BinaryRepository;
import br.ucs.greencitizenship.services.exceptions.DataBaseException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BinaryService {

    private final BinaryRepository repository;
    private final BinaryDtoToEntityAdapter adapter;

    public BinaryDTO findById(Integer id){
        Binary entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Binary Id not found: " + id));
        return adapter.toDto(entity);
    }

    public BinaryDTO insert(BinaryDTO dto){
        Binary entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public BinaryDTO update(BinaryDTO dto){
        if(!repository.existsById(dto.getId())){
            throw new ResourceNotFoundException("Id not found: " + dto.getId());
        }
        Binary entity = adapter.toEntity(dto);
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
