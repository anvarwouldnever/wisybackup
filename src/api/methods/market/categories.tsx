import api2 from "../../api";

export const GetCategories = () => {
    return api2.get(`/market/categories`);
};