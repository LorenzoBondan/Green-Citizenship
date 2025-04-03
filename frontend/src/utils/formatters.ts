export function formatDate(dateString: string): string {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        throw new Error("Invalid date format, use 'yyyy-MM-dd'.");
    }
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}

export function formatLocalDateTime(localDateTime: string): string {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(localDateTime)) {
        throw new Error("Invalid date format, use 'yyyy-MM-ddTHH:mm:ss'.");
    }
    const [datePart, timePart] = localDateTime.split("T");
    const [year, month, day] = datePart.split("-");
    const [hour, minute] = timePart.split(":");
    return `${day}/${month}/${year} - ${hour}:${minute}`;
}