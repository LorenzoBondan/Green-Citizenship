package br.ucs.greencitizenship.services;

import br.ucs.greencitizenship.dtos.attachment.AttachmentDTO;
import br.ucs.greencitizenship.dtos.attachment.AttachmentDtoToEntityAdapter;
import br.ucs.greencitizenship.dtos.binary.BinaryDTO;
import br.ucs.greencitizenship.dtos.post.PostDtoToEntityAdapter;
import br.ucs.greencitizenship.dtos.postattachment.PostAttachmentDTO;
import br.ucs.greencitizenship.dtos.postattachment.PostAttachmentDtoToEntityAdapter;
import br.ucs.greencitizenship.dtos.postattachment.PostAttachmentPersist;
import br.ucs.greencitizenship.entities.PostAttachment;
import br.ucs.greencitizenship.repositories.PostAttachmentRepository;
import br.ucs.greencitizenship.services.exceptions.DataBaseException;
import br.ucs.greencitizenship.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostAttachmentService {

    private final PostAttachmentRepository repository;
    private final PostAttachmentDtoToEntityAdapter adapter;
    private final AuthService authService;
    private final BinaryService binaryService;
    private final AttachmentService attachmentService;
    private final AttachmentDtoToEntityAdapter attachmentDtoToEntityAdapter;
    private final PostDtoToEntityAdapter postDtoToEntityAdapter;

    public PostAttachmentDTO findById(Integer id){
        PostAttachment entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("PostAttachment Id not found: " + id));
        return adapter.toDto(entity);
    }

    public PostAttachmentDTO insert(PostAttachmentPersist dto){
        authService.validateSelfOrAdmin(dto.getPost().getAuthor().getId());

        BinaryDTO binary = binaryService.insert(new BinaryDTO(null, dto.getBytes()));
        AttachmentDTO attachment = attachmentService.insert(
                new AttachmentDTO(
                        null, binary, dto.getName()
                )
        );

        PostAttachment entity = PostAttachment.builder()
                .attachment(attachmentDtoToEntityAdapter.toEntity(attachment))
                .post(postDtoToEntityAdapter.toEntity(dto.getPost()))
                .build();
        entity = repository.save(entity);
        return adapter.toDto(entity);
    }

    public PostAttachmentDTO update(PostAttachmentPersist dto){
        authService.validateSelfOrAdmin(dto.getPost().getAuthor().getId());
        if(!repository.existsById(dto.getId())){
            throw new ResourceNotFoundException("Id not found: " + dto.getId());
        }
        PostAttachmentDTO postAttachment = findById(dto.getId());

        if (dto.getBytes() != null) {
            BinaryDTO binary = postAttachment.getAttachment().getBinary();
            binary.setBytes(dto.getBytes());
            binaryService.update(binary);
        }

        AttachmentDTO attachment = postAttachment.getAttachment();
        attachment.setName(dto.getName());
        attachmentService.update(attachment);

        return postAttachment;
    }

    public void delete(Integer id){
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Id not found: " + id);
        }
        try{
            authService.validateSelfOrAdmin(findById(id).getPost().getAuthor().getId());
            repository.deleteById(id);
        } catch(DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }
}
