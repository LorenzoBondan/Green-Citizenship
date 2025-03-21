package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.post.PostDTO;
import br.ucs.greencitizenship.dtos.post.PostDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Post;
import br.ucs.greencitizenship.repositories.PostRepository;
import br.ucs.greencitizenship.services.exceptions.DataBaseException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository repository;
    private final PostDtoToEntityAdapter adapter;

    public Page<PostDTO> findAllByTitleAndCategory(String title, Integer categoryId, Pageable pageable){
        Page<Post> list = repository.findByTitleAndCategory(title, categoryId, pageable);
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
        Post entity = adapter.toEntity(dto);
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
