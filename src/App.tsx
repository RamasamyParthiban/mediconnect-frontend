import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Landing Page</div>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/patient/dashboard" element={<div>Patient Dashboard</div>} />
        <Route path="/patient/doctors" element={<div>Doctor Search</div>} />
        <Route path="/patient/appointments" element={<div>My Appointments</div>} />
        <Route path="/patient/prescriptions" element={<div>My Prescriptions</div>} />
        <Route path="/patient/payments" element={<div>My Payments</div>} />
        <Route path="/doctor/dashboard" element={<div>Doctor Dashboard</div>} />
        <Route path="/doctor/profile" element={<div>Doctor Profile</div>} />
        <Route path="/doctor/slots" element={<div>Add Slots</div>} />
        <Route path="/doctor/appointments" element={<div>Doctor Appointment</div>}/>
        <Route path="/doctor/prescriptions" element={<div>Write Prescriptions</div>} />    
      </Routes>
    </BrowserRouter>
  );
}

export default App;
