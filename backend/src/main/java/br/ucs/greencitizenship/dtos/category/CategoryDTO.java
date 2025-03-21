package br.ucs.greencitizenship.dtos.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CategoryDTO {

    private Integer id;
    @NotBlank
    @Size(max = 100)
    private String name;
}
