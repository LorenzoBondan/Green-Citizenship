package br.ucs.greencitizenship.entities;

import br.ucs.greencitizenship.entities.enums.StatusEnum;
import br.ucs.greencitizenship.entities.enums.converters.StatusEnumConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "tb_post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User author;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String title;
    private String description;
    private LocalDateTime date;
    @Convert(converter = StatusEnumConverter.class)
    private StatusEnum status;
    private Boolean isUrgent;

    @OneToOne(mappedBy = "post", cascade = CascadeType.REMOVE)
    private PostAttachment postAttachment;

    @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Like> likes = new ArrayList<>();

    @OneToMany(mappedBy = "comment", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    public Post(Integer id) {
        this.id = id;
    }
}
