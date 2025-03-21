package br.ucs.greencitizenship.controllers;

import br.ucs.greencitizenship.services.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Notification")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    private final NotificationService service;

    @Operation(summary = "Search all Notifications by User", method = "GET", description = "Search for all objects")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CITIZEN')")
    @GetMapping
    public ResponseEntity<?> findAllByUser(@RequestParam(value = "userId") Integer userId, Pageable pageable){
        return ResponseEntity.ok(service.findAllByUserId(userId, pageable));
    }

    /**
     * @param id Notification id to be changed
     */
    @Operation(summary = "Change the isRead of a Notification", method = "PATCH", description = "The object has the isRead attribute changed")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not found")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CITIZEN')")
    @PatchMapping(value = "/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable("id") Integer id){
        service.updateIsRead(id);
        return ResponseEntity.ok().build();
    }
}
