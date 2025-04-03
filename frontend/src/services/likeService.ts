import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { DLike } from "../models/like";

const route = "/api/like";

export function insert(obj: DLike) {
    const config: AxiosRequestConfig = {
        method: "POST",
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