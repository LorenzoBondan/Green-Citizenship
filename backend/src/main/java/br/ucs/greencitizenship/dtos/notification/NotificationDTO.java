package br.ucs.greencitizenship.dtos.notification;

import br.ucs.greencitizenship.dtos.user.UserDTO;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class NotificationDTO {

    private Integer id;
    @NotNull
    private UserDTO user;
    @NotBlank
    @Size(max = 300)
    private String text;
    @NotNull
    @FutureOrPresent
    private LocalDateTime date = LocalDateTime.now();
    @NotNull
    private Boolean isRead = Boolean.FALSE;

    public NotificationDTO(Integer id) {
        this.id = id;
    }
}
