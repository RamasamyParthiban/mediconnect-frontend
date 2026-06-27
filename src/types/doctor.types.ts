export interface DoctoerRequest {
    name : string
    email : string
    phone : number
    specialization : string
    experience : number
    bio : string
    consultationFee : number
    location : string
}

export interface DoctorResponse {
    id : number
    userId : number
    name : string
    email : string
    phone : number
    specialization : string
    experience : number
    bio : string
    consultationFee : number
    location : string
    slots : SlotResponse[]
}

export interface SlotRequest {
    datetime : string
}

export interface SlotResponse {
    id : number
    booked : boolean
    dateTime : string
}
