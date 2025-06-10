package br.ucs.greencitizenship.controllers;

import br.ucs.greencitizenship.dtos.userattachment.UserAttachmentDTO;
import br.ucs.greencitizenship.dtos.userattachment.UserAttachmentPersist;
import br.ucs.greencitizenship.services.UserAttachmentService;
import br.ucs.greencitizenship.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "User Attachment")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/userattachment")
public class UserAttachmentController {

    private final UserAttachmentService service;
    private final UserService userService;

    /**
     * @param id represents the ID of the UserAttachment to be searched
     */
    @Operation(summary = "Search a UserAttachment by id", method = "GET", description = "Search for an object by id, regardless of its status")
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
     * @param userId    user id
     * @param file      multipart file.
     * @param name      file name
     */
    @Operation(summary = "Insert a new UserAttachment", method = "POST")
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
            @RequestParam("userId") Integer userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "name", required = false) String name) {

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Erro ao processar o arquivo");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(service.insert(
                new UserAttachmentPersist(
                        null, bytes, name, userService.findById(userId)
                ))
        );
    }

    /**
     * @param id    userAttachment id
     * @param userId    user id
     * @param file      multipart file.
     * @param name      file name
     */
    @Operation(summary = "Update a UserAttachment", method = "PUT")
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
            @RequestParam("userId") Integer userId,
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

        return ResponseEntity.status(HttpStatus.OK).body(service.update(new UserAttachmentPersist(
                id, bytes, name, userService.findById(userId)
        )));
    }

    /**
     * @param id UserAttachment id to be removed
     */
    @Operation(summary = "Delete a UserAttachment", method = "DELETE", description = "The object is deleted from database")
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
