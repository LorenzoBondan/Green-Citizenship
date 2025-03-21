package br.ucs.greencitizenship.dtos.category;

import br.ucs.greencitizenship.dtos.Convertable;
import br.ucs.greencitizenship.entities.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryDtoToEntityAdapter implements Convertable<Category, CategoryDTO> {

    @Override
    public Category toEntity(CategoryDTO dto) {
        return Category.builder()
                .id(dto.getId())
                .name(dto.getName())
                .build();
    }

    @Override
    public CategoryDTO toDto(Category entity) {
        return CategoryDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }
}
