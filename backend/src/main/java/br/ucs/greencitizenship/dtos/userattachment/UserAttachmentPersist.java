package br.ucs.greencitizenship.dtos.userattachment;

import br.ucs.greencitizenship.dtos.user.UserDTO;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class UserAttachmentPersist {

    @EqualsAndHashCode.Include
    private Integer id;
    @NotNull
    private byte[] bytes;
    private String name;
    @NotNull
    private UserDTO user;
}
