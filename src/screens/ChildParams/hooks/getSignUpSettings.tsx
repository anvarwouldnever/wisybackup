import { useEffect, useState } from 'react'
import { GetSignUpSettings } from '../../../api/methods/auth/auth';

// Простейший кеш в памяти модуля
let cachedSettings: any[] | null = null;

export const getSettings = () => {
    const [loading, setLoading] = useState(!cachedSettings);
    const [error, setError] = useState<string | null>(null);
    const [settings, setSettings] = useState<Array<any>>(cachedSettings || []);

    useEffect(() => {
        if (cachedSettings) return;

        const fetchsettings = async () => {
            try {
                const response = await GetSignUpSettings();
                const newData = response?.data || [];

                cachedSettings = newData;
                setSettings(newData);
            } catch (e: any) {
                console.log(e);
                setError(e?.response?.data?.message || 'Ошибка загрузки настроек для регистрации');
            } finally {
                setLoading(false);
            }
        };

        fetchsettings();
    }, []);

    return { settings, loading, error };
};
