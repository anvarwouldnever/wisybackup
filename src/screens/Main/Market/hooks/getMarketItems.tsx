import { useEffect, useState } from 'react'
import { alertHandler } from '../../../../network/alertHandler'
import { checkNetwork } from '../../../../network/checkNetwork'
import { GetItems } from '../../../../api/methods/market/items'
import fetchAnimation from '../../FetchLottie'
import store from '../../../../store/store'

type Language = 'en' | 'lv';

const cachedItems: Record<Language, Record<number, any[]>> = {
    en: {},
    lv: {},
};

export const getMarketItems = (id: number) => {
    const rawLanguage = store.language as Language | null;
    const language: Language = rawLanguage ?? 'en';

    const hasCache = !!cachedItems[language][id];

    const [loading, setLoading] = useState(!hasCache);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<any[]>(cachedItems[language][id] ?? []);

    useEffect(() => {
        if (!id) return;

        if (cachedItems[language][id]) {
            setItems(cachedItems[language][id]);
            setLoading(false);
            return;
        }

        const fetchItems = async () => {
            setLoading(true);

            try {
                const network = await checkNetwork();
                if (!network) return alertHandler();

                const response = await GetItems(id);
                const data = response?.data?.data || [];

                const itemsWithAnimation = await Promise.all(
                    data.map(async (item: any) => {
                        try {
                            const uri = await fetchAnimation(item?.animation);
                            return { ...item, animation: uri };
                        } catch (e) {
                            console.warn('fetchAnimation failed for item', item?.id, e);
                            return { ...item };
                        }
                    })
                );

                cachedItems[language][id] = itemsWithAnimation;
                setItems(itemsWithAnimation);
            } catch (e: any) {
                console.log(e?.response?.data);
                setError(
                    e?.response?.data?.message ||
                    'Ошибка загрузки айтемов'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [id, language]);

    return { items, loading, error };
};
