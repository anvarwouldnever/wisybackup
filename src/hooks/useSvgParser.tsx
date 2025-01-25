import { useEffect, useState } from 'react';

const useSvgParser = (uri) => {
    const [svgContent, setSvgContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSvg = async () => {
            try {
                const response = await fetch(uri);
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status}`);
                }
                const svg = await response.text();
                setSvgContent(svg);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSvg();
    }, [uri]);

    return { svgContent, loading, error };
};

export default useSvgParser;
