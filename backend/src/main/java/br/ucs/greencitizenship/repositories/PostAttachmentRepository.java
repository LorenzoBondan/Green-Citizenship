package br.ucs.greencitizenship.repositories;

import br.ucs.greencitizenship.entities.PostAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostAttachmentRepository extends JpaRepository<PostAttachment, Integer> {
}
