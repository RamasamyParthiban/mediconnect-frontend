import axios from "axios";
import { store } from "../store/store";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
})

axiosInstance.interceptors.request.use((config) => {
   const token = store.getState().auth.token;
   if(token){
    config.headers.Authorization = `Bearer ${token}`
   }
   return config;
})

export default axiosInstance;