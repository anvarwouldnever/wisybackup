import api2 from "../../api2";

export const GetConversation = (childId: string) => {
    return api2.get(`/conversation`, {
        params: {
            child_id: childId
        }
    });
};