import axios from "axios";
import store from "../store/store";
import * as SecureStore from 'expo-secure-store';

export const BASE_URL: string = 'https://apimywisy.hostweb.uz/api/v1/app';
const BASE_TOKEN_PROD = '785|8jaYl21lkpzjaXxCFUkvFsk2KkT9LtBg0E7lg9PH63bed5e4';
const BASE_TOKEN_DEV = '663|O4WvH9kMy77WpybMik95SY1ZUYZ68R9zmRiL0Yu657b03656';

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(
    async (config: any) => {

        const token = await SecureStore.getItemAsync('token');
        const language = store?.language

        if (!config.skipAuth) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        config.headers['X-localization'] = language;

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;