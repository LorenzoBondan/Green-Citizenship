import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";

const route = "/api/postattachment";

export function findById(id: number) {
    return requestBackend({ 
        url: `${route}/${id}`
    });
}

export function insert(postId: number, file: File, name?: string) {
    const formData = new FormData();
    formData.append("id", postId.toString());
    formData.append("file", file);
    if (name) formData.append("name", name);

    const config: AxiosRequestConfig = {
        method: "POST",
        url: `${route}`,
        withCredentials: true,
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    };

    return requestBackend(config);
}

export function update(postAttachmentId: number, file?: File, name?: string) {
    const formData = new FormData();
    formData.append("id", postAttachmentId.toString());
    if (file) formData.append("file", file);
    if (name) formData.append("name", name);

    const config: AxiosRequestConfig = {
        method: "PUT",
        url: `${route}`,
        withCredentials: true,
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    };

    return requestBackend(config);
}

export function deleteById(id: number) {
    const config : AxiosRequestConfig = {
        method: "DELETE",
        url: `${route}/${id}`,
        withCredentials: true
    }

    return requestBackend(config);
}