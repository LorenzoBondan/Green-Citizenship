import { DAttachment } from "./attachment";
import { DPost } from "./post";

export type DPostAttachment = {
    id: number;
    post: DPost;
    attachment: DAttachment;
}