package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.role.RoleDTO;
import br.ucs.greencitizenship.dtos.role.RoleDtoToEntityAdapter;
import br.ucs.greencitizenship.entities.Role;
import br.ucs.greencitizenship.repositories.RoleRepository;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository repository;
    private final RoleDtoToEntityAdapter adapter;

    public Page<RoleDTO> findAll(Pageable pageable){
        Page<Role> list = repository.findAll(pageable);
        return list.map(adapter::toDto);
    }

    public RoleDTO findById(Integer id){
        Role entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Role Id not found: " + id));
        return adapter.toDto(entity);
    }
}
