import { useEffect, useState } from 'react'
import { checkNetwork } from '../../../network/checkNetwork'
import { GetOnboardings } from '../../../api/methods/onboardings.tsx/onboardings'
import { alertHandler } from '../../../network/alertHandler'
import store from '../../../store/store'

type Language = 'en' | 'lv';

const cachedOnboardings: Record<Language, any | null> = {
    en: null,
    lv: null,
};

export const getOnboardings = () => {
    const language = store.language as Language;

    const [loading, setLoading] = useState(!cachedOnboardings[language]);
    const [error, setError] = useState<string | null>(null);
    const [onboardings, setOnboardings] = useState<any>(cachedOnboardings[language]);

    useEffect(() => {
        if (cachedOnboardings[language]) {
            setOnboardings(cachedOnboardings[language]);
            setLoading(false);
            return;
        }

        const fetchOnboardings = async () => {
            setLoading(true);

            try {
                const network = await checkNetwork();
                if (!network) return alertHandler();

                const response = await GetOnboardings();
                const data = response?.data?.data;

                cachedOnboardings[language] = data;
                setOnboardings(data);
            } catch (e: any) {
                console.log(e?.response?.data);
                setError(
                    e?.response?.data?.message ||
                    'Ошибка загрузки онбордингов'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOnboardings();
    }, [language]);

    return { onboardings, loading, error };
};
