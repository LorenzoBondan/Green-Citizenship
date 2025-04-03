import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { DComment } from "../models/comment";

const route = "/api/comment";

export function findById(id: number) {
    return requestBackend({ 
        url: `${route}/${id}`
    });
}

export function insert(obj: DComment) {
    const config: AxiosRequestConfig = {
        method: "POST",
        url: `${route}`,
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function update(obj: DComment) {
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