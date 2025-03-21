package br.ucs.greencitizenship.dtos.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum StatusEnumDTO {

    IN_REVISION(1, "In Revision"),
    IN_PROGRESS(2, "In Progress"),
    COMPLETED(3, "Completed"),
    CANCELED(4, "Canceled");

    private final Integer value;
    private final String label;

    public static StatusEnumDTO fromValue(Integer value) {
        for (StatusEnumDTO obj : StatusEnumDTO.values()) {
            if (obj.value.equals(value)) {
                return obj;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}