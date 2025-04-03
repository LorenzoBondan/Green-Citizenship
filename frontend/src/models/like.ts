import { DComment } from "./comment";
import { DPost } from "./post";
import { DUser } from "./user";

export type DLike = {
    id: number;
    user: DUser;
    post: DPost;
    comment: DComment;
}