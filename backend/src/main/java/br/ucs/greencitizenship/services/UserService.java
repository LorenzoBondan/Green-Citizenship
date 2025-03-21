package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.user.UserDTO;
import br.ucs.greencitizenship.dtos.user.UserDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Role;
import br.ucs.greencitizenship.entities.User;
import br.ucs.greencitizenship.projections.UserDetailsProjection;
import br.ucs.greencitizenship.repositories.UserRepository;
import br.ucs.greencitizenship.services.exceptions.DataBaseException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository repository;
    private final UserDtoToEntityAdapter adapter;
    private final AuthService authService;

    public Page<UserDTO> findAll(Pageable pageable){
        Page<User> list = repository.findAll(pageable);
        return list.map(adapter::toDto);
    }

    public UserDTO findById(Integer id){
        User entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User Id not found: " + id));
        authService.validateSelfOrAdmin(id);
        return adapter.toDto(entity);
    }

    public UserDTO findByEmail(String email){
        User entity = repository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User Email not found: " + email));
        authService.validateSelfOrAdmin(entity.getId());
        return adapter.toDto(entity);
    }

    public UserDTO findMe() {
        User entity = authService.authenticated();
        return adapter.toDto(entity);
    }

    public UserDTO insert(UserDTO dto){
        User entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public UserDTO update(UserDTO dto){
        if(!repository.existsById(dto.getId())){
            throw new ResourceNotFoundException("Id not found: " + dto.getId());
        }
        authService.validateSelfOrAdmin(dto.getId());
        User entity = adapter.toEntity(dto);
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public void delete(Integer id){
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Id not found: " + id);
        }
        try{
            authService.validateSelfOrAdmin(id);
            repository.deleteById(id);
        } catch(DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        List<UserDetailsProjection> result = repository.searchUserAndRolesByEmail(username);
        if (result.isEmpty()) {
            throw new UsernameNotFoundException("Email not found");
        }

        User user = new User();
        user.setEmail(result.get(0).getUsername());
        user.setPassword(result.get(0).getPassword());
        for (UserDetailsProjection projection : result) {
            user.getRoles().add(new Role(projection.getRoleId(), projection.getAuthority()));
        }

        return user;
    }
}
