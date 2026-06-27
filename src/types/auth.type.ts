export interface LoginRequest {
    email : string
    password : string
} 

export interface RegisterRequest {
    name : string
    email : string
    password : string
    phone : number
    role : 'PATIENT' | 'DOCTOR'
}

export interface LoginResponse {
    token : string
    name : string
    role : string
}

export interface UserResponse {
    id : number
    name : string
    email : string
    phone : number
    role : string
}