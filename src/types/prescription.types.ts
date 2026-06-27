export interface PrescriptionRequest {
    appointmentId : number
    medicines : MedicineRequest[]
    instructions : string
}

export interface PrescriptionResponse {
        id : number
        appointmentId : number
        patientId : number
        doctorId: number
        medicines : MedicineResponse[]
        instructions : string
        prescribedAt : string
}

export interface MedicineRequest {

    name : string
    dosage : string
    frequency : string
    duration : string

}

export interface MedicineResponse {
    id : number
    name : string
    dosage : string
    frequency : string
    duration : string

}