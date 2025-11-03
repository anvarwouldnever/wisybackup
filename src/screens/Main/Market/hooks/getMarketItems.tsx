import { useEffect, useState } from 'react'
import { alertHandler } from '../../../../network/alertHandler';
import { checkNetwork } from '../../../../network/checkNetwork';
import { GetItems } from '../../../../api/methods/market/items';
import fetchAnimation from '../../FetchLottie';

let cachedItems: any = null;

export const getMarketItems = (id: number) => {
    const [loading, setLoading] = useState(!cachedItems);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<any>(cachedItems);

    useEffect(() => {

        if (cachedItems) {
            setItems(cachedItems);
            setLoading(false);
            return;
        }

        if (!id) return

        const fetchItems = async () => {
            try {
                const network = await checkNetwork()
                if (!network) return alertHandler()

                const response = await GetItems(id)
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

                cachedItems = itemsWithAnimation;
                setItems(itemsWithAnimation);
            } catch (e: any) {
                console.log(e?.response?.data);
                setError(e?.response?.data?.message || 'Ошибка загрузки айтемов');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [id]);

    return { items, loading, error };
}