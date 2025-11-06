import { useEffect, useState } from 'react'
import { GetCategories } from '../../../../api/methods/game/categories';
import { alertHandler } from '../../../../network/alertHandler';
import { checkNetwork } from '../../../../network/checkNetwork';
import { gameStore } from '../../../Games/store/gameStore';

export const getCategories = () => {
    const [loading, setLoading] = useState(!gameStore.categories);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (gameStore.categories) {
            setLoading(false)
            return
        };

        const fetchCategories = async () => {
            try {
                const network = await checkNetwork()
                if (!network) return alertHandler()

                const response = await GetCategories();

                const categories = response.data?.data.map(category => ({
                    ...category,
                    collections: [],
                }));

                gameStore.setCategories(categories)                
                
            } catch (e: any) {
                console.log(e);
                setError(e?.response?.data?.message || 'Ошибка загрузки категорий');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { loading, error };
};
