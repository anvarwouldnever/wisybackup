import api2 from "../../api";

export const AnswerVoiceTask = (taskId: string, attempt: string, childId: string, leadTime: number, voice: any) => {

    const formData = new FormData();
    formData.append('task_id', taskId);
    formData.append('attempt', attempt);
    formData.append('child_id', childId);
    formData.append('lead_time', `${leadTime}`);
    formData.append('voice', {
        uri: voice,
        type: 'audio/m4a',
        name: 'voice-recording.m4a',
    });

    return api2.post(`/tasks/answer`, formData ,{
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

export const AnswerSimpleChoice = (taskId: string, attempt: string, childId: string, leadTime: number, answer: any) => {
    return api2.post(`/tasks/answer`, {
        task_id: taskId,
        attempt: attempt,
        child_id: childId,
        answer: answer,
        lead_time: leadTime
    });
};

export const AnswerObjectMatching = (taskId: string, attempt: string, childId: string, leadTime: number, success: boolean, pairId: string, targetPairId: string) => {
    return api2.post(`/tasks/answer`, {
        task_id: taskId,
        attempt: attempt,
        child_id: childId,
        success: success,
        lead_time: leadTime,
        pair_id: pairId,
        target_pair_id: targetPairId
    });
};

export const AnswerDragAndDrop = (taskId: string, attempt: string, childId: string, leadTime: number, success: boolean, answerId: string, imageId: string) => {
    return api2.post(`/tasks/answer`, {
        task_id: taskId,
        attempt: attempt,
        child_id: childId,
        success: success,
        lead_time: leadTime,
        answer_id: answerId,
        image_id: imageId
    });
};

export const AnswerHandWritten= (taskId: string, attempt: string, childId: string, leadTime: number, images: any) => {

    const formData = new FormData();
    formData.append('task_id', `${taskId}`);
    formData.append('attempt', `${attempt}`);
    formData.append('child_id', `${childId}`);
    formData.append('lead_time', `${leadTime}`);
        
    images.forEach(({ image, index }) => {
        formData.append(`images[${index}]`, image);
    });

    return api2.post(`/tasks/answer`, formData ,{
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

