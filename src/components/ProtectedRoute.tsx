import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children:React.ReactNode
    allowedRole: string
}

function ProtectedRoute({children, allowedRole}: ProtectedRouteProps) {

    const{isAuthenticated, role} = useSelector(
        (state:RootState) => state.auth
    )

    //Not logged in at all
    if(!isAuthenticated){
        return <Navigate to="/login" />
    }

    //logged in but wrong role - send them to their own dashboard

    if(role != allowedRole){
        return role === 'PATIENT'
        ? <Navigate to="/patient/dashboard"/>
        : <Navigate to="/doctor/dashboard" />
    }

    return <>{children}</>
}

export default ProtectedRoute;