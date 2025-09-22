import api2 from "../../api2";

export const GetAvatars = () => {
    return api2.get(`/avatars`);
};