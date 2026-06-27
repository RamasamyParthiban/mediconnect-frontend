import axiosInstance from "../utils/axiosConfig";
import type { DoctoerRequest, DoctorResponse, SlotRequest, SlotResponse } from "../types/doctor.types";


export const registerDoctor = async (data: DoctoerRequest): Promise<DoctorResponse> => {
    const response = await axiosInstance.post("/api/doctors/register", data)
    return response.data
}

export const addSlot = async (data: SlotRequest): Promise<SlotResponse> => {
    const response = await axiosInstance.post("/api/doctors/slot", data)
    return response.data
}

export const getDoctorById = async (id: number): Promise<DoctorResponse> => {
    const response = await axiosInstance.get(`/api/doctors/id/${id}`)
   return response.data
}

export const getDoctorsBySpecialization = async (specialization: string): Promise<DoctorResponse[]> => {
    const response = await axiosInstance.get(`/api/doctors/${specialization}`)

    return response.data
}

export const getAllDoctors = async (): Promise<DoctorResponse[]> => {
    
    const response = await axiosInstance.get('/api/doctors')

    return response.data
}

export const getAllSlots = async (doctorId: number): Promise<SlotResponse[]> => {
    
    const response = await axiosInstance.get(`/api/doctors/slots/${doctorId}`)

    return response.data
}

export const updateDoctorProfile = async (data: DoctoerRequest): Promise<DoctorResponse> => {
    const response = await axiosInstance.put("/api/doctors/update", data)
    return response.data
}
