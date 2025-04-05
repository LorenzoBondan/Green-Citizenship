package br.ucs.greencitizenship.controllers;

import br.ucs.greencitizenship.dtos.post.PostDTO;
import br.ucs.greencitizenship.services.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Post")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/post")
public class PostController {

    private final PostService service;

    @Operation(summary = "Search all Posts by Title and Category", method = "GET", description = "Search for all objects")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @Transactional(readOnly = true)
    @GetMapping
    public ResponseEntity<?> findAllByTitleAndCategoryAndStatus(
            @RequestParam(value = "title", required = false, defaultValue = "") String title,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "statusId") List<Integer> statusId,
            Pageable pageable){
        return ResponseEntity.ok(service.findAllByTitleAndCategoryAndStatus(title, categoryId, statusId, pageable));
    }

    /**
     * @param id represents the ID of the Post to be searched
     */
    @Operation(summary = "Search a Post by id", method = "GET", description = "Search for an object by id, regardless of its status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not found")
    })
    @Transactional(readOnly = true)
    @GetMapping(value = "/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") Integer id){
        return ResponseEntity.ok(service.findById(id));
    }

    /**
     * @param dto represents the Post object to be created
     */
    @Operation(summary = "Insert a new Post", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "409", description = "Conflict"),
            @ApiResponse(responseCode = "422", description = "Unprocessable Entity")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CITIZEN')")
    @PostMapping
    public ResponseEntity<?> create(
            @Valid @RequestBody
            @Schema(
                    description = "Post object for creation",
                    requiredProperties = "author.id, category.id, title, description",
                    example = """
                    {
                        "author": {
                            "id": 1
                        },
                        "category": {
                            "id": 1
                        },
                        "title": "title",
                        "description": "description",
                        "date": "2025-01-01T00:00:00",
                        "status": "IN_REVISION",
                        "isUrgent": false
                    }
                    """
            )
            PostDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.insert(dto));
    }

    /**
     * @param dto represents the Post object to be updated
     */
    @Operation(summary = "Update a Post", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "409", description = "Conflict"),
            @ApiResponse(responseCode = "422", description = "Unprocessable Entity")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CITIZEN')")
    @PutMapping
    public ResponseEntity<?> update(
            @Valid @RequestBody
            @Schema(
                    description = "Post object for editing",
                    requiredProperties = "id, author.id, category.id, title, description",
                    example = """
                    {
                        "id": 1,
                        "author": {
                            "id": 1
                        },
                        "category": {
                            "id": 1
                        },
                        "title": "title",
                        "description": "description",
                        "date": "2025-01-01T00:00:00",
                        "status": "IN_REVISION",
                        "isUrgent": false
                    }
                    """
            )
            PostDTO dto){
        return ResponseEntity.ok(service.update(dto));
    }

    /**
     * @param id Post id to be removed
     */
    @Operation(summary = "Delete a Post", method = "DELETE", description = "The object is deleted from database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "No content"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "409", description = "Integrity violation")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CITIZEN')")
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> remove(@PathVariable("id") Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
