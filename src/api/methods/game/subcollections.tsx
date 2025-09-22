import api2 from "../../api2";

export const GetSubcollections = (collectionId: string, childId: string) => {
    return api2.get(`/sub-collections`, {
        params: {
            collection_id: collectionId,
            child_id: childId
        }
    });
};