import api2 from "../../api2";

export const GetItems = (id) => {
    return api2.get(`/market/categories/${id}/items`);
};