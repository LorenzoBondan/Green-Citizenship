package br.ucs.greencitizenship.controllers;

import br.ucs.greencitizenship.dtos.userattachment.UserAttachmentDTO;
import br.ucs.greencitizenship.services.UserAttachmentService;
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

@Tag(name = "User Attachment")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/userattachment")
public class UserAttachmentController {

    private final UserAttachmentService service;

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
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CITIZEN')")
    @GetMapping(value = "/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") Integer id){
        return ResponseEntity.ok(service.findById(id));
    }

    /**
     * @param dto represents the UserAttachment object to be created
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
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(
            @Valid  @RequestBody
            @Schema(
                    description = "UserAttachment object for creation",
                    requiredProperties = "user.id, attachment.id",
                    example = """
                    {
                        "user": {
                            "id": 1
                        },
                        "attachment": {
                            "id": 1
                        }
                    }
                    """
            )
            UserAttachmentDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.insert(dto));
    }

    /**
     * @param dto represents the UserAttachment object to be updated
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
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @PutMapping
    public ResponseEntity<?> update(
            @Valid @RequestBody
            @Schema(
                    description = "UserAttachment object for editing",
                    requiredProperties = "id, user.id, attachment.id",
                    example = """
                    {
                        "id": 1,
                        "user": {
                            "id": 1
                        },
                        "attachment": {
                            "id": 1
                        }
                    }
                    """
            )
            UserAttachmentDTO dto){
        return ResponseEntity.ok(service.update(dto));
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
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> remove(@PathVariable("id") Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
