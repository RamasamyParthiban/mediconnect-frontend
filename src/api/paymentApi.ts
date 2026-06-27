import axiosInstance from "../utils/axiosConfig";
import type { PaymentRequest, PaymentResponse } from "../types/payment.types";


export const makePayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
   const response = await axiosInstance.post('/api/payments/pay', data)
    return response.data
}

export const getPaymentHistory = async (): Promise<PaymentResponse[]> => {

    const response = await  axiosInstance.get('/api/payments/history')

    return response.data
}