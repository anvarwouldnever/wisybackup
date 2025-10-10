import { runOnJS } from "react-native-reanimated";

const IsPointInsideImage = (x, y, key, offsets, imageLayouts, answered, answer, setWrongObject, addToAnswered, images) => {
    'worklet';
        const adjustedX = x + offsets.horizontal; // Учитываем смещение по X
        const adjustedY = y + offsets.vertical; // Учитываем смещение по Y
        const totalImages = imageLayouts.value.length;
    
        let rightSideThreshold = 0;
    
        if (totalImages === 5) {
            rightSideThreshold = 2;
        } else if (totalImages === 6) {
            rightSideThreshold = 3;
        } else if (totalImages <= 4) {
            rightSideThreshold = 0; // Нет правых элементов
        }
    
        for (let i = 0; i < totalImages; i++) {
            const image = imageLayouts.value[i];
    
            if (
                adjustedX >= image.x &&
                adjustedX <= image.x + image.width &&
                adjustedY >= image.y &&
                adjustedY <= image.y + image.height
            ) {
                const isRightSide = i >= totalImages - rightSideThreshold; // Проверяем, правый ли элемент
                const isCorrect = image.key === key;

                const originalImage = images.find(img => img.key === image.key);

                if (image.key !== key) {
                    if (answered.includes(image.key)) {
                        return { inside: false }
                    }
                    runOnJS(answer)({ answer: false, pair_id: originalImage?.id, target_pair_id: originalImage?.target_pair?.id });
                    runOnJS(setWrongObject)(key)
                    return {
                        inside: true,
                        newX: isRightSide ? image.x - offsets.horizontal : image.x + image.width - offsets.horizontal,
                        newY: image.y + image.height / 2 - offsets.vertical,
                        targetIndex: i,
                        color: isCorrect ? '#ADD64D' : '#EA6E6E',
                    }; 
                }

                runOnJS(addToAnswered)(key);
    
                return {
                    inside: true,
                    newX: isRightSide ? image.x - offsets.horizontal : image.x + image.width - offsets.horizontal,
                    newY: image.y + image.height / 2 - offsets.vertical,
                    targetIndex: i,
                    color: isCorrect ? '#ADD64D' : '#EA6E6E',
                };
            }
        }

    return { inside: false };
};

export default IsPointInsideImage