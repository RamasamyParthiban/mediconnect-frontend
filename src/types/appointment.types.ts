export interface AppointmentRequest {
    doctorId : number
    slotId : number
    notes : string
}

export interface AppointmentResponse {
    id : number
    doctorId : number
    patientId : number
    slotId : number
    bookedAt : string
    notes : string
    appointmentStatus : 'PENDING' | 'CONFIRMED' | 'CANCELLED'
}

