import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { DPost } from "../models/post";

const route = "/api/post";

export function findAll(title: string, categoryId: number, page: number, pageSize = 12, sort: string) {
    sort = sort || "id;desc";
    
    const config : AxiosRequestConfig = {
        method: "GET",
        url: `${route}`,
        params: {
            title,
            categoryId,
            sort,
            page,
            pageSize
        }
    }

    return requestBackend(config);
}

export function findById(id: number) {
    return requestBackend({ 
        url: `${route}/${id}`
    });
}

export function insert(obj: DPost) {
    const config: AxiosRequestConfig = {
        method: "POST",
        url: `${route}`,
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function update(obj: DPost) {
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