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
    booksAt : string
    notes : string
    appointmentStatus : 'PENDING' | 'CONFIRMED' | 'CANCELLED'
}

