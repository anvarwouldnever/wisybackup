import api2 from "../../api2";

export const GetCollections = (categoryId: string, childId: string) => {
    return api2.get(`/collections`, {
        params: {
            category_id: categoryId,
            child_id: childId
        }
    });
};