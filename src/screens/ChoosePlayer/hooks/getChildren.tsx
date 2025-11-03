import { useEffect, useState } from 'react'
import { checkNetwork } from '../../../network/checkNetwork';
import { GetChildren } from '../../../api/methods/children/children';
import { alertHandler } from '../../../network/alertHandler';

let cachedChildren: any = null;

export const clearChildrenCache = () => {
    cachedChildren = null;
};

export const getChildren = () => {
    const [loading, setLoading] = useState(!cachedChildren);
    const [error, setError] = useState<string | null>(null);
    const [children, setChildren] = useState<any>(cachedChildren);

    useEffect(() => {
        if (cachedChildren) {
            setChildren(cachedChildren);
            setLoading(false);
            return;
        }

        const fetchchildren = async () => {
            try {
                const network = await checkNetwork()
                if (!network) return alertHandler()

                const response = await GetChildren()
                cachedChildren = response?.data?.data;
                setChildren(response?.data?.data);
            } catch (e: any) {
                console.log(e?.response?.data);
                setError(e?.response?.data?.message || 'Ошибка загрузки детей');
            } finally {
                setLoading(false);
            }
        };

        fetchchildren();
    }, []);

    return { children, loading, error };
}