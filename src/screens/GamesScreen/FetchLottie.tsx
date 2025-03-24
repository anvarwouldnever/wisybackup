const fetchAnimation = async (url: string) => {
    console.log("fetchAnimation вызван с URL:", url);

    try {
        const response = await fetch(url);
        console.log("Ответ получен, статус:", response.status);

        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);

        const blob = await response.blob();
        console.log("Blob загружен, размер:", blob.size, "байт");

        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                console.log("FileReader завершил чтение.");
                
                const text = reader.result as string;
                console.log(`Длина ответа: ${text.length} символов`);

                try {
                    const animationJson = JSON.parse(text);
                    console.log("JSON успешно распаршен.");
                    resolve(animationJson);
                } catch (jsonError) {
                    console.error("Ошибка парсинга JSON:", jsonError);
                    reject(jsonError);
                }
            };

            reader.onerror = (err) => {
                console.error("Ошибка FileReader:", err);
                reject(err);
            };

            console.log("Читаем blob как текст...");
            reader.readAsText(blob);
        });
    } catch (error) {
        console.error("Ошибка в fetchAnimation:", error);
    }
};

export default fetchAnimation;
