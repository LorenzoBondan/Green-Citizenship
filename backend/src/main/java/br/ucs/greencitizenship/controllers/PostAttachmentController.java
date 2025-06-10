package br.ucs.greencitizenship.controllers;

import br.ucs.greencitizenship.dtos.postattachment.PostAttachmentPersist;
import br.ucs.greencitizenship.services.PostAttachmentService;
import br.ucs.greencitizenship.services.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "Post Attachment")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/postattachment")
public class PostAttachmentController {

    private final PostAttachmentService service;
    private final PostService postService;

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
     * @param postId    post id
     * @param file      multipart file.
     * @param name      file name
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
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam("postId") Integer postId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "name", required = false) String name) {

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Erro ao processar o arquivo");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(service.insert(
                new PostAttachmentPersist(
                        null, bytes, name, postService.findById(postId)
                ))
        );
    }

    /**
     * @param id    postAttachment id
     * @param postId    post id
     * @param file      multipart file.
     * @param name      file name
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
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @RequestParam("id") Integer id,
            @RequestParam("postId") Integer postId,
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "name", required = false) String name) {

        byte[] bytes = null;
        if (file != null && !file.isEmpty()) {
            try {
                bytes = file.getBytes();
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Erro ao processar o arquivo");
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(service.update(new PostAttachmentPersist(
                id, bytes, name, postService.findById(postId)
        )));
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
