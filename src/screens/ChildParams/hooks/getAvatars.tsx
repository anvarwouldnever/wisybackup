import { useEffect, useState } from 'react'
import { GetAvatars } from '../../../api/methods/avatars/avatars';

// Простейший кеш в памяти модуля
let cachedAvatars: any[] | null = null;

export const getAvatars = () => {
    const [loading, setLoading] = useState(!cachedAvatars);
    const [error, setError] = useState<string | null>(null);
    const [avatars, setAvatars] = useState<Array<any>>(cachedAvatars || []);

    useEffect(() => {
        if (cachedAvatars) return; // если уже есть — не грузим снова

        const fetchAvatars = async () => {
            try {
                const response = await GetAvatars();
                const newData = response?.data?.data || [];

                cachedAvatars = newData; // кладём в кеш
                setAvatars(newData);
            } catch (e: any) {
                console.log(e);
                setError(e?.response?.data?.message || 'Ошибка загрузки аватаров');
            } finally {
                setLoading(false);
            }
        };

        fetchAvatars();
    }, []);

    return { avatars, loading, error };
};
