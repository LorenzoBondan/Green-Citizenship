export const DStatusEnum = {
    IN_REVISION: { name: "IN_REVISION", value: 1, label: "Em revisão" },
    IN_PROGRESS: { name: "IN_PROGRESS", value: 2, label: "Em andamento" },
    COMPLETED: { name: "COMPLETED", value: 3, label: "Concluído" },
    CANCELED: { name: "CANCELED", value: 4, label: "Cancelado" }
} as const;