import axios from "axios";
import { store } from "../store/store";

const axiosInstance = axios.create({
    baseURL:  import.meta.env.VITE_API_URL || 'http://localhost:8080',
})

axiosInstance.interceptors.request.use((config) => {
    console.log('Default URL',import.meta.env.VITE_API_URL)
   const token = store.getState().auth.token;
   if(token){
    config.headers.Authorization = `Bearer ${token}`
   }
   return config;
})

export default axiosInstance;