package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.category.CategoryDTO;
import br.ucs.greencitizenship.dtos.category.CategoryDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Category;
import br.ucs.greencitizenship.repositories.CategoryRepository;
import br.ucs.greencitizenship.services.exceptions.DataBaseException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;
    private final CategoryDtoToEntityAdapter adapter;

    public Page<CategoryDTO> findAll(Pageable pageable){
        Page<Category> list = repository.findAll(pageable);
        return list.map(adapter::toDto);
    }

    public CategoryDTO findById(Integer id){
        Category entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category Id not found: " + id));
        return adapter.toDto(entity);
    }

    public CategoryDTO insert(CategoryDTO dto){
        Category entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public CategoryDTO update(CategoryDTO dto){
        if(!repository.existsById(dto.getId())){
            throw new ResourceNotFoundException("Id not found: " + dto.getId());
        }
        Category entity = adapter.toEntity(dto);
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
