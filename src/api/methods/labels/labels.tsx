import api2 from "../../api";

export const GetLabels = () => {
    return api2.get(`/labels`);
};