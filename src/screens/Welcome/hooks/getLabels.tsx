import { useEffect, useState } from 'react'
import { checkNetwork } from '../../../network/checkNetwork'
import { GetLabels } from '../../../api/methods/labels/labels'
import { alertHandler } from '../../../network/alertHandler'
import store from '../../../store/store'

type Language = 'en' | 'lv';

const cachedLabels: Record<Language, any | null> = {
    en: null,
    lv: null,
};

export const getLabels = () => {

    const rawLanguage = store?.language as Language | null;
    const language: Language = rawLanguage ?? 'en';

    const [loading, setLoading] = useState(!cachedLabels[language]);
    const [error, setError] = useState<string | null>(null);
    const [labels, setLabels] = useState<any>(cachedLabels[language]);

    useEffect(() => {
        if (cachedLabels[language]) {
            setLabels(cachedLabels[language]);
            setLoading(false);
            return;
        }

        const fetchLabels = async() => {
            setLoading(true);

            try {
                const network = await checkNetwork();
                if (!network) return alertHandler();

                const response = await GetLabels()
                const data = response?.data;

                cachedLabels[language] = data;
                setLabels(data);
            } catch (e: any) {
                console.log(e?.response?.data);
                setError(
                    e?.response?.data?.message ||
                    'Ошибка загрузки лейблов'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLabels();
    }, [language]);

    return { labels, loading, error };
};
