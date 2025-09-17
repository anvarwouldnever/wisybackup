import * as Haptics from 'expo-haptics'

const CheckDropZone = (touchX, touchY, draggedUri, draggedItem, placeholders, placeholderObjects, answer, setPlaceholderObjects, setDraggableObjects, setAnswered, draggableObjects, setLock) => {

        let hit = false;

        for (const [id, { x, y, width, height }] of placeholders.entries()) {
            const isInside = touchX >= x && touchX <= x + width && touchY >= y && touchY <= y + height;
    
            if (isInside) {
                const foundPlaceholder = placeholderObjects.find(p => p.id === id);
                if (!foundPlaceholder.possibleAnswers.includes(draggedItem.id)) {
                    answer({answer: false, answer_id: id, image_id: draggedItem.id});
                    hit = false;
                    break;
                }

                setPlaceholderObjects((prev) =>
                    prev.map((p) =>
                        p.id === id ? { ...foundPlaceholder, draggedUri } : p
                    )
                );

                setDraggableObjects((prev) =>
                    prev.filter((obj) => obj.id !== draggedItem.id)
                );
                
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    
                setAnswered((prev) => {
                    const filtered = prev.filter(item => item !== id);
                    return [...filtered, id];
                });

                const filteredIds = foundPlaceholder.possibleAnswers.filter(id => id !== draggedItem.id);
                const exists = draggableObjects.some(obj => filteredIds.includes(obj.id));
                if (exists) {
                    setLock(true)
                    setTimeout(() => {
                        setAnswered((prev) => prev.filter(item => item !== id));
                        setPlaceholderObjects((prev) =>
                            prev.map((p) =>
                                p.id === id ? { ...p, draggedUri: null } : p
                            )
                        );
                    setLock(false)
                    }, 1500);
                }
    
                hit = true;
                break;
            }
        }
    
        return hit;
};

export default CheckDropZone;

























// setId({id: id, result: 'wrong'});
                    // setOpacity(0);


// setAnswered((prev) => prev.filter(answeredId => answeredId !== id));
                    // setPlaceholderObjects((prev) =>
                    //     prev.map((p) =>
                    //         p.id === id ? { ...foundPlaceholder, draggedUri } : p
                    //     )
                    // );
                    // setTimeout(() => {
                    //     setPlaceholderObjects((prev) =>
                    //         prev.map((p) =>
                    //             p.id === id ? { ...foundPlaceholder, draggedUri: null } : p
                    //         )
                    //     );
                    //     setId(null)
                    //     setOpacity(1)
                    // }, 1500);