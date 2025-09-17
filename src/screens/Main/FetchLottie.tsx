import * as FileSystem from "expo-file-system/legacy";

const fetchAnimation = async (url: string) => {
  try {
        const filename = url.split("/").pop()!;
        const fileUri = `${FileSystem.cacheDirectory}animations/${filename}`;

        const dirUri = `${FileSystem.cacheDirectory}animations`;
        const dirInfo = await FileSystem.getInfoAsync(dirUri);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
        }

        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
            return fileUri;
        }

        const { uri } = await FileSystem.downloadAsync(url, fileUri);
        return uri;
    } catch (error) {
        console.log("Ошибка загрузки анимации", error);
        return null;
    }
};

export default fetchAnimation;
