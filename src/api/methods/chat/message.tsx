import api2 from "../../api";

export const Message = (childId: string, isText: boolean, message: string, audio: any) => {

    const formData = new FormData();
    formData.append('child_id', childId);

    if (isText) {
        formData.append('message', message);
    } else {
        formData.append('audio', {
            uri: audio,
            type: 'audio/m4a',
            name: 'voice-recording.m4a',
        });
    }

    return api2.post(`/conversation`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};