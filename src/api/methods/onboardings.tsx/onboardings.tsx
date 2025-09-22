import api2 from "../../api2";

export const GetOnboardings = () => {
    return api2.get(`/onboardings`);
};