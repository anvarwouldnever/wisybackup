import api2 from "../../api";

export const GetAvatars = () => {
    return api2.get(`/avatars`);
};