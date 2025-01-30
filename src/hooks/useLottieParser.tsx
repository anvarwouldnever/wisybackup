import { useState, useEffect } from 'react';

const useLottieParser = (jsonUrl: string | null) => {
    const [animationData, setAnimationData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('started')
        const fetchAnimation = async () => {
            if (!jsonUrl) return { animationData, loading, error };

            setLoading(true);
            try {
                const response = await fetch(jsonUrl);
                if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
                
                const animationJson = await response.json();
                setAnimationData(animationJson);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimation();
    }, [jsonUrl]);

    return { animationData, loading, error };
};

export default useLottieParser;
