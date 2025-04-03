import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { DPostAttachment } from "../models/postAttachment";

const route = "/api/postattachment";

export function findById(id: number) {
    return requestBackend({ 
        url: `${route}/${id}`
    });
}

export function insert(obj: DPostAttachment) {
    const config: AxiosRequestConfig = {
        method: "POST",
        url: `${route}`,
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function update(obj: DPostAttachment) {
    const config: AxiosRequestConfig = {
        method: "PUT",
        url: `${route}`,
        withCredentials: true,
        data: obj
    }

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