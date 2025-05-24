import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";

const route = "/api/role";

export function findAll(page?: number, size = 12, sort?: string) {
    sort = sort || "id,desc";
    
    const config : AxiosRequestConfig = {
        method: "GET",
        url: `${route}`,
        params: {
            sort,
            page,
            size
        }
    }

    return requestBackend(config);
}

export function findById(id: number) {
    return requestBackend({ 
        url: `${route}/${id}`
    });
}