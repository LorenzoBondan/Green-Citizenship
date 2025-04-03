import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";

const route = "/api/notification";

export function findAllByUserId(userId: number) {
    return requestBackend({ 
        url: `${route}}`,
        params: {
            userId
        }, 
        withCredentials: true 
    });
}

export function updateIsRead(id: number) {
    const config: AxiosRequestConfig = {
        method: "PATCH",
        url: `${route}/${id}`,
        withCredentials: true
    }

    return requestBackend(config);
}