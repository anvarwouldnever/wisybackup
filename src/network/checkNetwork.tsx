import * as Network from 'expo-network';

export const checkNetwork = async (): Promise<boolean> => {
    try {
        const networkState = await Network.getNetworkStateAsync();
        return Boolean(networkState.isConnected && networkState.isInternetReachable !== false);
    } catch (e) {
        console.log('Ошибка при проверке сети', e);
        return false;
    }
};