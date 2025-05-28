package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.attachment.AttachmentDTO;
import br.ucs.greencitizenship.dtos.attachment.AttachmentDtoToEntityAdapter;
import br.ucs.greencitizenship.dtos.binary.BinaryDTO;
import br.ucs.greencitizenship.dtos.user.UserDtoToEntityAdapter;
import br.ucs.greencitizenship.dtos.userattachment.UserAttachmentDTO;
import br.ucs.greencitizenship.dtos.userattachment.UserAttachmentDtoToEntityAdapter;
import br.ucs.greencitizenship.dtos.userattachment.UserAttachmentPersist;
import br.ucs.greencitizenship.entities.UserAttachment;
import br.ucs.greencitizenship.repositories.UserAttachmentRepository;
import br.ucs.greencitizenship.services.exceptions.DataBaseException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserAttachmentService {

    private final UserAttachmentRepository repository;
    private final UserAttachmentDtoToEntityAdapter adapter;
    private final AuthService authService;
    private final BinaryService binaryService;
    private final AttachmentService attachmentService;
    private final AttachmentDtoToEntityAdapter attachmentDtoToEntityAdapter;
    private final UserDtoToEntityAdapter userDtoToEntityAdapter;

    public UserAttachmentDTO findById(Integer id){
        UserAttachment entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("UserAttachment Id not found: " + id));
        return adapter.toDto(entity);
    }

    public UserAttachmentDTO insert(UserAttachmentPersist dto){
        authService.validateSelfOrAdmin(dto.getUser().getId());

        BinaryDTO binary = binaryService.insert(new BinaryDTO(null, dto.getBytes()));
        AttachmentDTO attachment = attachmentService.insert(
                new AttachmentDTO(
                        null, binary, dto.getName()
                )
        );

        UserAttachment entity = UserAttachment.builder()
                .attachment(attachmentDtoToEntityAdapter.toEntity(attachment))
                .user(userDtoToEntityAdapter.toEntity(dto.getUser()))
                .build();
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public UserAttachmentDTO update(UserAttachmentPersist dto){
        authService.validateSelfOrAdmin(dto.getUser().getId());
        if(!repository.existsById(dto.getId())){
            throw new ResourceNotFoundException("Id not found: " + dto.getId());
        }
        UserAttachmentDTO userAttachment = findById(dto.getId());

        if (dto.getBytes() != null) {
            BinaryDTO binary = userAttachment.getAttachment().getBinary();
            binary.setBytes(dto.getBytes());
            binaryService.update(binary);
        }

        AttachmentDTO attachment = userAttachment.getAttachment();
        attachment.setName(dto.getName());
        attachmentService.update(attachment);

        return userAttachment;
    }

    public void delete(Integer id){
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Id not found: " + id);
        }
        try{
            authService.validateSelfOrAdmin(findById(id).getId());
            repository.deleteById(id);
        } catch(DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }
}
