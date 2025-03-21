package br.ucs.greencitizenship.dtos.role;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class RoleDTO {

    private Integer id;
    private String authority;
}
