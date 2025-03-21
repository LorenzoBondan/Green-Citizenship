package br.ucs.greencitizenship.dtos;

public interface Convertable<E,D> {

    E toEntity(D dto);
    D toDto(E entity);
}
