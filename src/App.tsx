import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorSearch from "./pages/patient/DoctorSearch";
import MyAppointments from "./pages/patient/MyAppointments";
import MyPrescriptions from "./pages/patient/MyPrescriptions";
import MyPayments from "./pages/patient/MyPayments";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";

function AppContent() {
  const location = useLocation();

  //Pages where Navbar should Not show

  const hideNavbar = ["/", "/login", "/register"];
  const showLayout = !hideNavbar.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {showLayout && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<div>Landing Page</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/patient/dashboard"
            element={<PatientDashboard/>}
          />
          <Route path="/patient/doctors" element={<DoctorSearch/>} />
          <Route
            path="/patient/appointments"
            element={<MyAppointments/>}
          />
          <Route
            path="/patient/prescriptions"
            element={<MyPrescriptions/>}
          />
          <Route path="/patient/payments" element={<MyPayments/>} />
          <Route
            path="/doctor/dashboard"
            element={<DoctorDashboard />}
          />
          <Route path="/doctor/profile" element={<div>Doctor Profile</div>} />
          <Route path="/doctor/slots" element={<div>Add Slots</div>} />
          <Route
            path="/doctor/appointments"
            element={<div>Doctor Appointment</div>}
          />
          <Route
            path="/doctor/prescription"
            element={<div>Write Prescriptions</div>}
          />
           <Route
            path="/about"
            element={<div>About Us</div>}
          />
           <Route
            path="/contact"
            element={<div>Contact Us</div>}
          />
           <Route
            path="/terms"
            element={<div>Terms and Condition</div>}
          />
        </Routes>
      </main>
      {showLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
