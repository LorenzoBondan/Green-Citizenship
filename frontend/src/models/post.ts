import { DCategory } from "./category";
import { DComment } from "./comment";
import { DStatusEnum } from "./enums/statusEnum";
import { DLike } from "./like";
import { DPostAttachment } from "./postAttachment";
import { DUser } from "./user";

export type DPost = {
    id: number;
    author: DUser;
    category: DCategory;
    title: string;
    description: string;
    date: Date;
    status: keyof typeof DStatusEnum;
    isUrgent: boolean;
    postAttachment: DPostAttachment;

    likes: DLike[];
    comments: DComment[];
}