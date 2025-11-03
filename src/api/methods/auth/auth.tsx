import api2 from "../../api";

export const Login = (email: string, password: string) => {
    return api2.post(`/auth/login`, { email: email, password: password });
};

export const Register = (email: string, password: string) => {
    return api2.post(`/auth/register`, { email: email, password: password });
};

export const ForgotPassword = (email: string) => {
    return api2.post(`/auth/forgot-password`, { email: email });
};

export const ChangePassword = (password: string) => {
    return api2.post(`/auth/change-password`, { password: password });
};

export const ResetPassword = (email: string, token: string, password: string, passwordConfirmator: string) => {
    return api2.post(`/auth/reset-password`, { 
        email: email,
        token: token,
        password: password,
        password_confirmation: passwordConfirmator
    });
};

export const GetSignUpSettings = () => {
    return api2.get(`/sign-up-settings`);
};