import api from "./axios";

export const login = (email, password) =>
  api.post("/auth/token/", { email, password });

export const register = (userData) => api.post("/auth/register/", userData);

export const getProfile = () => api.get("/auth/profile/");

export const updateProfile = (data) => api.patch("/auth/profile/", data);

export const changePassword = (data) => api.post("/auth/change-password/", data);
