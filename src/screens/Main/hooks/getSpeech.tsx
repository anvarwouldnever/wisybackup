import { GetSpeeches } from '../../../api/methods/speeches/speech'
import store from '../../../store/store'

type Language = 'en' | 'lv';

const speechCache = new Map<string, any>();

export const clearSpeechCache = () => {
    speechCache.clear();
};

const getCacheKey = (name: string, language: Language) =>
    `${language}:${name}`;

export const getSpeech = async (name: string) => {
    const rawLanguage = store.language as Language | null;
    const language: Language = rawLanguage ?? 'en';

    const cacheKey = getCacheKey(name, language);

    if (speechCache.has(cacheKey)) {
        return speechCache.get(cacheKey);
    }

    const response = await GetSpeeches(name);

    speechCache.set(cacheKey, response);

    return response;
};
