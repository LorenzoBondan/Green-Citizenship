package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.entities.User;
import br.ucs.greencitizenship.repositories.UserRepository;
import br.ucs.greencitizenship.services.exceptions.ForbiddenException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import br.ucs.greencitizenship.utils.CustomUserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final CustomUserUtil customUserUtil;

    public User authenticated() {
        try {
            String username = customUserUtil.getLoggedUsername();
            return repository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User Email not found " + username));
        }
        catch (Exception e) {
            throw new UsernameNotFoundException("Invalid user");
        }
    }

    public void validateSelfOrAdmin(Integer id) {
        User me = authenticated();
        if (me.hasRole("ROLE_ADMIN")) {
            return;
        }
        if(!me.getId().equals(id)) {
            throw new ForbiddenException("Access denied. Should be self or admin");
        }
    }

    public boolean isAdmin() {
        User user = authenticated();
        return user.hasRole("ROLE_ADMIN");
    }
}
