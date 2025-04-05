package br.ucs.greencitizenship.repositories;

import br.ucs.greencitizenship.entities.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT * FROM tb_post p WHERE
        UPPER(p.title) LIKE UPPER(CONCAT(:title, '%'))
        AND p.status IN :statusId
        AND :categoryId IS NULL OR :categoryId = p.category_id
    """)
    Page<Post> findByTitleAndCategoryAndStatus(@Param("title") String title,
                                               @Param("categoryId") Integer categoryId,
                                               @Param("statusId") List<Integer> statusId,
                                               Pageable pageable);
}
