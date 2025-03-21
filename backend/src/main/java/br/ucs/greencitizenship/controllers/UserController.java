package br.ucs.greencitizenship.controllers;

import br.ucs.greencitizenship.dtos.user.UserDTO;
import br.ucs.greencitizenship.services.UserService;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Tag(name = "User")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService service;

    @Operation(summary = "Search all Users", method = "GET", description = "Search for all objects")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CITIZEN')")
    @GetMapping
    public ResponseEntity<?> findAll(Pageable pageable){
        return ResponseEntity.ok(service.findAll(pageable));
    }

    /**
     * @param id represents the ID of the User to be searched
     */
    @Operation(summary = "Search a User by id", method = "GET", description = "Search for an object by id, regardless of its status")
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
     * @param email represents the email of the User to be searched
     */
    @Operation(summary = "Search a User by email", method = "GET", description = "Search for an object by email, regardless of its status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not found")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ANALYST', 'ROLE_OPERATOR')")
    @GetMapping(value = "/email/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable("email") String email){
        return ResponseEntity.ok(service.findByEmail(email));
    }

    @Operation(summary = "Search the logged User", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not found")
    })
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CITIZEN')")
    @GetMapping(value = "/me")
    public ResponseEntity<?> findMe(){
        return ResponseEntity.ok(service.findMe());
    }

    /**
     * @param dto represents the User object to be created
     */
    @Operation(summary = "Insert a new User", method = "POST")
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
                    description = "User object for creation",
                    requiredProperties = "name, email, password",
                    example = """
                    {
                        "name": "Name",
                        "password": "12345",
                        "email": "email@email.com"
                    }
                    """
            )
            UserDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.insert(dto));
    }

    /**
     * @param dto represents the User object to be updated
     */
    @Operation(summary = "Update a User", method = "PUT")
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
                    description = "User object for editing",
                    requiredProperties = "id, name, password, email",
                    example = """
                    {
                        "id": 1,
                        "name": "Name",
                        "password": "12345",
                        "email": "email@email.com"
                    }
                    """
            )
            UserDTO dto){
        return ResponseEntity.ok(service.update(dto));
    }

    /**
     * @param id User id to be removed
     */
    @Operation(summary = "Delete a User", method = "DELETE", description = "The object is deleted from database")
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
