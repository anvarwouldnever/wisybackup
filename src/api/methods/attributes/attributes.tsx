import api2 from "../../api2";

export const GetAttributes = () => {
    return api2.get(`/attributes`);
};

export const GetChildAttributes = (attributeId: string, childId: string, from?: string, to?: string) => {
    return api2.get(`/attributes/${attributeId}`, {
        params: {
            child_id: childId,
            from: from,
            to: to
        }
    });
};