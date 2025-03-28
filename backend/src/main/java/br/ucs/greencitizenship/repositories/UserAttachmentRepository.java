package br.ucs.greencitizenship.repositories;

import br.ucs.greencitizenship.entities.UserAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAttachmentRepository extends JpaRepository<UserAttachment, Integer> {
}
