import { useEffect, useState } from 'react'
import { alertHandler } from '../../../network/alertHandler';
import { checkNetwork } from '../../../network/checkNetwork';
import { GetConversation } from '../../../api/methods/chat/conversation';
import { chatStore } from '../store/chatStore';

let cachedMessages: any = null;

export const clearCache = () => {
    cachedMessages = null
}

export const getMessages = (id: string) => {
    const [loading, setLoading] = useState(!cachedMessages);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cachedMessages) {
            setLoading(false);
            return;
        }

        const fetchMessages = async () => {
            try {
                const network = await checkNetwork()
                if (!network) return alertHandler()

                const response = await GetConversation(id)

                const formattedMessages = response.data?.data?.map(item => {
                    return {
                        type: 'text',
                        text: item?.content,
                        author: item?.is_from_bot ? 'MyWisy' : 'You'
                    };
                });

                chatStore.setMessages(formattedMessages.reverse())
                cachedMessages = formattedMessages

            } catch (e: any) {
                console.log(e?.response?.data);
                setError(e?.response?.data?.message || 'Ошибка загрузки детей');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    return { loading, error };
}