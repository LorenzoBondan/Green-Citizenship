package br.ucs.greencitizenship.repositories;

import br.ucs.greencitizenship.entities.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Integer> {
}
