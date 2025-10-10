import axios from "axios";
import store from "../store/store";

const BASE_URL = 'https://apimywisy.hostweb.uz/api/v1/app';
const BASE_TOKEN_PROD = '616|O9tjAOn5GVJGEBNOGTfjtD13giLgUmjV0xuZya0768fe3751';
const BASE_TOKEN_DEV = '663|O4WvH9kMy77WpybMik95SY1ZUYZ68R9zmRiL0Yu657b03656';

const api2 = axios.create({
    baseURL: BASE_URL,
});

api2.interceptors.request.use(
    async (config: any) => {

        const token = store.token;
        const language = store.language
        
        if (!config.skipAuth) {
            if (BASE_TOKEN_PROD) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        config.headers['X-localization'] = language;
        
        return config;
    },
    (error) => Promise.reject(error)
);

export default api2;