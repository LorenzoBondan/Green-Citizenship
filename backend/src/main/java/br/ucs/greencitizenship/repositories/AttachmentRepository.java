package br.ucs.greencitizenship.repositories;

import br.ucs.greencitizenship.entities.Binary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BinaryRepository extends JpaRepository<Binary, Integer> {
}
