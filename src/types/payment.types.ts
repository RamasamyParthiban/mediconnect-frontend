export interface PaymentRequest {
    appointmentId : number
    paymentMethod : 'CARD' | 'UPI' | 'CASH'
}

export interface PaymentResponse {

    id : number
    appointmentId : number
    patientId : number 
    doctorId : number
    amount : number
    paymentMethod :  'CARD' | 'UPI' | 'CASH'
    paymentStatus : 'PENDING' | 'SUCCESS' | 'FAILED' 
    transactionId : string
    paidAt : string
}