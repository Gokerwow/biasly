import { BaseFandomURL } from "@/constants";
import axios from "axios";

export const apiClient = axios.create({
    baseURL: BaseFandomURL,
    headers: {
        'Content-Type': 'application/json',
    }
})