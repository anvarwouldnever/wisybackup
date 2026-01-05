import { useEffect, useState } from 'react'
import { GetCategories } from '../../../../api/methods/market/categories'
import { alertHandler } from '../../../../network/alertHandler'
import { checkNetwork } from '../../../../network/checkNetwork'
import store from '../../../../store/store'

type Language = 'en' | 'lv';

const cachedCategories: Record<Language, any | null> = {
    en: null,
    lv: null,
};

export const getMarketCategories = () => {
    const rawLanguage = store.language as Language | null;
    const language: Language = rawLanguage ?? 'en';

    const [loading, setLoading] = useState(!cachedCategories[language]);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<any>(cachedCategories[language]);

    useEffect(() => {
        if (cachedCategories[language]) {
            setCategories(cachedCategories[language]);
            setLoading(false);
            return;
        }

        const fetchCategories = async () => {
            setLoading(true);

            try {
                const network = await checkNetwork();
                if (!network) return alertHandler();

                const response = await GetCategories();
                const data = response?.data?.data;

                cachedCategories[language] = data;
                setCategories(data);
            } catch (e: any) {
                console.log(e?.response?.data);
                setError(
                    e?.response?.data?.message ||
                    'Ошибка загрузки категорий'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [language]);

    return { categories, loading, error };
};
