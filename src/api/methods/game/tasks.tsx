import api2 from "../../api";

export const GetTasks = (subcollectionId: number) => {
    return api2.get(`/tasks`, {
        params: {
            sub_collection_id: subcollectionId
        }
    });
};