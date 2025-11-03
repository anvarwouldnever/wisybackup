import { useEffect, useState } from 'react'
import { GetAttributes } from '../../../api/methods/attributes/attributes';
import { alertHandler } from '../../../network/alertHandler';
import { checkNetwork } from '../../../network/checkNetwork';
import useSvgParser from './useSvgParser';

let cachedAttributes: any = null;

export const getAttributes = () => {
    const [loading, setLoading] = useState(!cachedAttributes);
    const [error, setError] = useState<string | null>(null);
    const [attributes, setAttributes] = useState<any>(cachedAttributes);

    useEffect(() => {
        if (cachedAttributes) {
            setAttributes(cachedAttributes);
            setLoading(false);
            return;
        }

        const fetchAttributes = async () => {
            try {
                const network = await checkNetwork()
                if (!network) return alertHandler()

                const response = await GetAttributes()
                let data = response?.data?.data || []

                const withParsedSvg = await Promise.all(
                    data.map(async (item: any) => {
                        if (item?.image?.endsWith('.svg')) {
                            const parsedSvg = await useSvgParser(item?.image)
                            return { ...item, svgData: parsedSvg }
                        }
                        return item
                    })
                )

                cachedAttributes = withParsedSvg
                setAttributes(withParsedSvg)

            } catch (e: any) {
                console.log(e?.response?.data);
                setError(e?.response?.data?.message || 'Ошибка загрузки детей');
            } finally {
                setLoading(false);
            }
        };

        fetchAttributes();
    }, []);

    return { attributes, loading, error };
}