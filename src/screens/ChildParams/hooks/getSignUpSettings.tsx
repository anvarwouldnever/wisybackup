import { useEffect, useState } from 'react'
import { GetSignUpSettings } from '../../../api/methods/auth/auth'
import { alertHandler } from '../../../network/alertHandler'
import { checkNetwork } from '../../../network/checkNetwork'
import store from '../../../store/store'

type Language = 'en' | 'lv';

const cachedSettings: Record<Language, any[] | null> = {
    en: null,
    lv: null,
};

export const getSettings = () => {
    const language = store.language as Language;

    const [loading, setLoading] = useState(!cachedSettings[language]);
    const [error, setError] = useState<string | null>(null);
    const [settings, setSettings] = useState<any[]>(cachedSettings[language] || []);

    useEffect(() => {
        if (cachedSettings[language]) {
            setSettings(cachedSettings[language]!);
            setLoading(false);
            return;
        }

        const fetchSettings = async () => {
            setLoading(true);

            try {
                const network = await checkNetwork();
                if (!network) return alertHandler();

                const response = await GetSignUpSettings();
                const newData = response?.data || [];

                cachedSettings[language] = newData;
                setSettings(newData);
            } catch (e: any) {
                console.log(e);
                setError(
                    e?.response?.data?.message ||
                    'Ошибка загрузки настроек для регистрации'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [language]);

    return { settings, loading, error };
};
