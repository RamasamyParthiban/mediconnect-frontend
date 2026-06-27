import axiosInstance from "../utils/axiosConfig";
import type { LoginRequest, RegisterRequest, LoginResponse, UserResponse } from "../types/auth.type"; 



export const loginUser = async (data: LoginRequest ): Promise<LoginResponse> => {
   const response = await axiosInstance.post('/api/users/login', data)
   return response.data
}

export const registerUser = async (data : RegisterRequest ): Promise<UserResponse> => {
    const response = await axiosInstance.post('/api/users/register', data)
    return response.data
}

