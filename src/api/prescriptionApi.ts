import axiosInstance from "../utils/axiosConfig";
import type { PrescriptionRequest, PrescriptionResponse } from "../types/prescription.types";


export const savePrescription = async (data: PrescriptionRequest): Promise<PrescriptionResponse> => {

    const response = await axiosInstance.post('/api/prescriptions/save', data)

    return response.data
}


export const getPatientPrescriptions = async (): Promise<PrescriptionResponse[]> => {
    const response = await axiosInstance.get('/api/prescriptions/patient')

    return response.data
}


export const getDoctorPrescriptions = async (): Promise<PrescriptionResponse[]> => {
    const response = await axiosInstance.get('/api/prescriptions/doctor')

    return response.data
}
