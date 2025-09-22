import api2 from "../../api2";

export const GetChildren = () => {
    return api2.get(`/children`);
};

export const AddChild = (name: string, avatarId: string, birthday: string, gender: number, engagementTime: number) => {
    return api2.post(`/children`, {
        name: name,
        avatar_id: avatarId,
        birthday: birthday,
        gender: gender,
        engagement_time: engagementTime,
    })
}