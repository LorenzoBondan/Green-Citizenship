import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { DUser } from "../models/user";

const route = "/api/user";

export function findAll(page?: number, size = 12, sort?: string) {
    sort = sort || "id,desc";
    
    const config : AxiosRequestConfig = {
        method: "GET",
        url: `${route}`,
        params: {
            sort,
            page,
            size
        }, 
        withCredentials: true 
    }

    return requestBackend(config);
}

export function findById(id: number) {
    return requestBackend({ 
        url: `${route}/${id}`, 
        withCredentials: true 
    });
}

export function findByEmail(email: string) {
    return requestBackend({ 
        url: `${route}/email/${email}`, 
        withCredentials: true  
    });
}

export function findMe() {
    return requestBackend({ 
        url: `${route}/me`, 
        withCredentials: true  
    });
}

export function insert(obj: DUser) {
    const config: AxiosRequestConfig = {
        method: "POST",
        url: `${route}`,
        data: obj
    }

    return requestBackend(config);
}

export function update(obj: DUser) {
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