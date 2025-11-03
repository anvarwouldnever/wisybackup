import { runOnJS } from "react-native-reanimated";

const IsPointInsideAnswerLeft = (x, y, key, id, offsets, answersLayouts, answers, answered, answer, setWrongObject, addToAnswered) => {
    'worklet';
    const adjustedX = x + offsets.horizontal;
    const adjustedY = y + offsets.vertical;

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
                    newX: answerLayout.x - offsets.horizontal,
                    newY: answerLayout.y + answerLayout.height / 2 - offsets.vertical,
                    targetIndex: i,
                    color: isCorrect ? '#ADD64D' : '#EA6E6E',
                };
            }  

            runOnJS(addToAnswered)(key);
            return {
                inside: true,
                newX: answerLayout.x - offsets.horizontal,
                newY: answerLayout.y + answerLayout.height / 2 - offsets.vertical,
                targetIndex: i,
                color: isCorrect ? '#ADD64D' : '#EA6E6E',
            };
        }
    }
    return { inside: false };
}; 

export default IsPointInsideAnswerLeft