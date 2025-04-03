export const DStatusEnum = {
    IN_REVISION: { name: "IN_REVISION", value: 1, label: "In Revision" },
    IN_PROGRESS: { name: "IN_PROGRESS", value: 2, label: "In Progress" },
    COMPLETED: { name: "COMPLETED", value: 3, label: "Completed" },
    CANCELED: { name: "CANCELED", value: 4, label: "Canceled" }
} as const;