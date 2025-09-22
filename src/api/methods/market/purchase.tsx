import api2 from "../../api2";

export const Purchase = (childId: string, itemId: any) => {
    return api2.post(`/market/purchase/${itemId}`, {
        child_id: childId
    });
};