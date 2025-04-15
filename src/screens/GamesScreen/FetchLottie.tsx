const fetchAnimation = async (url: string) => {
    try {
        console.log("fetchAnimation вызван с URL:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);

        const animationJson = await response.json();
        console.log("JSON успешно загружен и распаршен.");

        return animationJson;
    } catch (error) {
        console.error("Ошибка в fetchAnimation:", error);
        throw error;
    }
};

export default fetchAnimation;
