import api2 from "../../api";

export const GetOnboardings = () => {
    return api2.get(`/onboardings`);
};