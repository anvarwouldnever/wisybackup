import api2 from "../../api";

export const GetAudios = () => {
    return api2.get(`/audios`);
};