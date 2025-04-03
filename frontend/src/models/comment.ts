import { DLike } from "./like";
import { DPost } from "./post";
import { DUser } from "./user";

export type DComment = {
    id: number;
    user: DUser;
    post: DPost;
    text: string;
    date: Date;

    likes: DLike[];
}