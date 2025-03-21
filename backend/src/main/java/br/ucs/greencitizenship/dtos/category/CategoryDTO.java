package br.ucs.greencitizenship.dtos.category;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CategoryDTO {

    private Integer id;
    private String name;
}
