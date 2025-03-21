package br.ucs.greencitizenship.dtos.user;

import br.ucs.greencitizenship.dtos.role.RoleDTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class UserDTO {

    private Integer id;
    @NotBlank(message = "Required field")
    @Size(min = 3, max = 50, message = "Name must have at least 3 characters and max 50")
    private String name;
    @NotBlank(message = "Required field")
    @Size(min = 3, max = 50, message = "Email must have at least 3 characters and max 50")
    @Email
    private String email;
    @NotBlank
    @Size(min = 3, max = 30)
    private String password;

    private List<RoleDTO> roles = new ArrayList<>();

    public UserDTO(Integer id) {
        this.id = id;
    }
}
