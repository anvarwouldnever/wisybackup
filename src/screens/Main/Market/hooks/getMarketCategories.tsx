import { useEffect, useState } from 'react'
import { GetCategories } from '../../../../api/methods/market/categories';
import { alertHandler } from '../../../../network/alertHandler';
import { checkNetwork } from '../../../../network/checkNetwork';

let cachedCategories: any = null;

export const getMarketCategories = () => {
    const [loading, setLoading] = useState(!cachedCategories);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<any>(cachedCategories);

    useEffect(() => {
        if (cachedCategories) {
            setCategories(cachedCategories);
            setLoading(false);
            return;
        }

        const fetchCategories = async () => {
            try {
                const network = await checkNetwork()
                if (!network) return alertHandler()

                const response = await GetCategories()
                cachedCategories = response?.data?.data;
                setCategories(response?.data?.data);
            } catch (e: any) {
                console.log(e?.response?.data);
                setError(e?.response?.data?.message || 'Ошибка загрузки детей');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
}