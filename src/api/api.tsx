import axios from "axios";
import store from "../store/store";
import * as SecureStore from 'expo-secure-store';

export const BASE_URL: string = 'https://tapimywisy.hostweb.uz/api/v1/app';
const BASE_TOKEN_PROD = '616|O9tjAOn5GVJGEBNOGTfjtD13giLgUmjV0xuZya0768fe3751';
const BASE_TOKEN_DEV = '663|O4WvH9kMy77WpybMik95SY1ZUYZ68R9zmRiL0Yu657b03656';

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(
    async (config: any) => {

        const token = SecureStore.getItem('token');
        const language = store.language
        
        if (!config.skipAuth) {
            config.headers.Authorization = `Bearer ${BASE_TOKEN_DEV}`;
        }

        config.headers['X-localization'] = language;
        
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;