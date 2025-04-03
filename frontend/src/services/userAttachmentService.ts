import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { DUserAttachment } from "../models/userAttachment";

const route = "/api/userattachment";

export function findById(id: number) {
    return requestBackend({ 
        url: `${route}/${id}`
    });
}

export function insert(obj: DUserAttachment) {
    const config: AxiosRequestConfig = {
        method: "POST",
        url: `${route}`,
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function update(obj: DUserAttachment) {
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