const fetchAnimation = async(url: string) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
        
        const animationJson = await response.json();
        return animationJson
    } catch (error) {
        console.log(error)
    }
};

export default fetchAnimation