import type { UserResponse } from "../types/auth.type";
import axiosInstance from "../utils/axiosConfig";

export const getUserById = async (id: number): Promise<UserResponse> => {
  const response = await axiosInstance.get(`/api/users/id/${id}`);

  return response.data;
};
