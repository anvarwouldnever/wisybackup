import { useEffect, useState } from 'react'
import { checkNetwork } from '../../../network/checkNetwork';
import { GetOnboardings } from '../../../api/methods/onboardings.tsx/onboardings';
import { alertHandler } from '../../../network/alertHandler';

let cachedOnboardings: any = null;

export const getOnboardings = () => {
    const [loading, setLoading] = useState(!cachedOnboardings);
    const [error, setError] = useState<string | null>(null);
    const [onboardings, setOnboardings] = useState<any>(cachedOnboardings);

    useEffect(() => {
        if (cachedOnboardings) {
            setOnboardings(cachedOnboardings);
            setLoading(false);
            return;
        }

        const fetchOnboardings = async () => {
            try {
                const network = await checkNetwork()
                if (!network) return alertHandler()

                const response = await GetOnboardings()
                cachedOnboardings = response?.data?.data;
                setOnboardings(response?.data?.data);
            } catch (e: any) {
                console.log(e?.response?.data);
                setError(e?.response?.data?.message || 'Ошибка загрузки онбордингов');
            } finally {
                setLoading(false);
            }
        };

        fetchOnboardings();
    }, []);

    return { onboardings, loading, error };
}