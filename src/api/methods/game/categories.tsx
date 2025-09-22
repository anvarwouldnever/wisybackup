import api2 from "../../api2";

export const GetCategories = () => {
    return api2.get(`/categories`);
};