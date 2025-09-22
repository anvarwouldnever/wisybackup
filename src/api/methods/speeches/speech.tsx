import api2 from "../../api2";

export const GetSpeeches = (categoryName: string) => {
    return api2.get(`/speeches`, {
        params: {
            category: categoryName
        }
    });
};