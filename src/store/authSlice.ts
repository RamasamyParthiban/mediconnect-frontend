import {createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


interface AuthState {
    token : string | null
    name : string | null
    role : string | null
    userId : number | null
    isAuthenticated: boolean
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    name: localStorage.getItem('name'),
    role: localStorage.getItem('role'),
    userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
    isAuthenticated: !!localStorage.getItem('token')
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers: {
        setCredentials: ( state, action: PayloadAction<{
            token: string
            name: string
            role: string
            userId: number
        }>) => {
            state.token = action.payload.token
            state.name = action.payload.name
            state.role = action.payload.role
            state.userId=action.payload.userId
            state.isAuthenticated = true
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('name', action.payload.name)
            localStorage.setItem('role', action.payload.role)
            localStorage.setItem('userId', action.payload.userId.toString())
        },
        logout: (state) => {
            state.token = null
            state.name= null
            state.role = null
            state.userId=null
            state.isAuthenticated=false
            localStorage.removeItem('token')
            localStorage.removeItem('name')
            localStorage.removeItem('role')
            localStorage.removeItem('userId')
        },
    },
})

export const {setCredentials , logout} = authSlice.actions;
export default authSlice.reducer;