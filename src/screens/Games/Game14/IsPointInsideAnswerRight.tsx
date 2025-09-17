import { runOnJS } from "react-native-reanimated";

const IsPointInsideAnswerRight = (x, y, key, id, mainContainerOffset, answersLayouts, answers, answered, answer, setWrongObject, addToAnswered) => {
        'worklet';
        const adjustedX = x + 30; // Учитываем смещение по X
        const adjustedY = y + mainContainerOffset.top;  
        
        for (let i = 0; i < answersLayouts.value.length; i++) {
            const answerLayout = answersLayouts.value[i];
    
            if (
                adjustedX >= answerLayout.x &&
                adjustedX <= answerLayout.x + answerLayout.width &&
                adjustedY >= answerLayout.y &&
                adjustedY <= answerLayout.y + answerLayout.height
            ) {
                const originalAnswer = answers.find(ans => ans.key === answerLayout.key);
                
                const isCorrect = answerLayout.key === key;

                if (answerLayout.key !== key) {
                    if (answered.includes(answerLayout.key)) {
                        return { inside: false }
                    }
                    runOnJS(answer)({ answer: false, pair_id: id, target_pair_id: originalAnswer?.id });
                    runOnJS(setWrongObject)(answerLayout.key)

                    return {
                        inside: true,
                        newX: answerLayout.x + answerLayout.width - 30, // Правая граница объекта
                        newY: answerLayout.y + answerLayout.height / 2 - mainContainerOffset.top,
                        targetIndex: i,
                        color: isCorrect ? '#ADD64D' : '#EA6E6E',
                    };
                }  
                
                runOnJS(addToAnswered)(key);
                return {
                    inside: true,
                    newX: answerLayout.x + answerLayout.width - 30, // Правая граница объекта
                    newY: answerLayout.y + answerLayout.height / 2 - mainContainerOffset.top,
                    targetIndex: i,
                    color: isCorrect ? '#ADD64D' : '#EA6E6E',
                };
            }
        }
        return { inside: false };
};

export default IsPointInsideAnswerRight