package br.ucs.greencitizenship.controllers;

import br.ucs.greencitizenship.dtos.postattachment.PostAttachmentDTO;
import br.ucs.greencitizenship.services.PostAttachmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Post Attachment")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/postattachment")
public class PostAttachmentController {

    private final PostAttachmentService service;

    /**
     * @param id represents the ID of the PostAttachment to be searched
     */
    @Operation(summary = "Search a PostAttachment by id", method = "GET", description = "Search for an object by id, regardless of its status")
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
     * @param dto represents the PostAttachment object to be created
     */
    @Operation(summary = "Insert a new PostAttachment", method = "POST")
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
            @Valid  @RequestBody
            @Schema(
                    description = "PostAttachment object for creation",
                    requiredProperties = "post.id, attachment.id",
                    example = """
                    {
                        "post": {
                            "id": 1
                        },
                        "attachment": {
                            "id": 1
                        }
                    }
                    """
            )
            PostAttachmentDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.insert(dto));
    }

    /**
     * @param dto represents the PostAttachment object to be updated
     */
    @Operation(summary = "Update a PostAttachment", method = "PUT")
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
                    description = "PostAttachment object for editing",
                    requiredProperties = "id, post.id, attachment.id",
                    example = """
                    {
                        "id": 1,
                        "post": {
                            "id": 1
                        },
                        "attachment": {
                            "id": 1
                        }
                    }
                    """
            )
            PostAttachmentDTO dto){
        return ResponseEntity.ok(service.update(dto));
    }

    /**
     * @param id PostAttachment id to be removed
     */
    @Operation(summary = "Delete a PostAttachment", method = "DELETE", description = "The object is deleted from database")
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
