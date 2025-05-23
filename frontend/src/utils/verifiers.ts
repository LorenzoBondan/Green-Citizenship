import { DPost } from "../models/post";
import { DUser } from "../models/user";

export function isProjectLiked(post: DPost, user: DUser): boolean {
    return post.likes.some(like => like.user.id === user.id);
}
