import { DAttachment } from "./attachment";
import { DUser } from "./user";

export type DUserAttachment = {
    id: number;
    user: DUser;
    attachment: DAttachment;
}