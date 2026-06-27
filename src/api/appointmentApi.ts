import axiosInstance from "../utils/axiosConfig";
import type { AppointmentRequest, AppointmentResponse } from "../types/appointment.types";


export const bookAppointment = async (data: AppointmentRequest): Promise<AppointmentResponse> => {

    const response = await axiosInstance.post('/api/appointments/book', data)

    return response.data
}

export const cancelAppointment = async (id: number): Promise<AppointmentResponse> => {

        const response = await axiosInstance.put(`/api/appointments/cancel/${id}`)

        return response.data;
}

export const getPatientAppointments = async (): Promise<AppointmentResponse[]> => {
    const response = await axiosInstance.get('/api/appointments/patient')

    return response.data
}

export const getDoctorAppointments = async (): Promise<AppointmentResponse[]> => {
    const response = await axiosInstance.get('/api/appointments/doctor')

    return response.data
}
