import { DUser } from "./user";

export type DNotification = {
    id: number;
    user: DUser;
    text: string;
    date: Date;
    isRead: boolean;
}