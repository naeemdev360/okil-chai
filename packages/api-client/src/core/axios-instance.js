import axios from 'axios';
import { ApiError } from './errors';
export function createAxiosInstance(config) {
    const instance = axios.create({
        baseURL: `${config.baseUrl}/api/v1`,
        // No global Content-Type — axios auto-sets application/json for plain objects
        // and multipart/form-data (with boundary) when data is FormData.
        timeout: 15_000,
    });
    instance.interceptors.request.use((req) => {
        const token = config.getToken();
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
        return req;
    });
    instance.interceptors.response.use(undefined, (error) => {
        if (axios.isAxiosError(error) && error.response != null) {
            throw new ApiError(error.response.data);
        }
        throw error;
    });
    return instance;
}
