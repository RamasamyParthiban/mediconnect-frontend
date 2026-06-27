import {createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


interface AuthState {
    token : string | null
    name : string | null
    role : string | null
    isAuthenticated: boolean
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    name: localStorage.getItem('name'),
    role: localStorage.getItem('role'),
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
        }>) => {
            state.token = action.payload.token
            state.name = action.payload.name
            state.role = action.payload.role
            state.isAuthenticated = true
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('name', action.payload.name)
            localStorage.setItem('role', action.payload.role)
        },
        logout: (state) => {
            state.token = null
            state.name= null
            state.role = null
            state.isAuthenticated=false
            localStorage.removeItem('token')
            localStorage.removeItem('name')
            localStorage.removeItem('role')
        },
    },
})

export const {setCredentials , logout} = authSlice.actions;
export default authSlice.reducer;