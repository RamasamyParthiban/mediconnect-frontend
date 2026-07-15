import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorSearch from "./pages/patient/DoctorSearch";
import MyAppointments from "./pages/patient/MyAppointments";
import PDFTest from "./test/PDFTest";
import MyPrescriptions from "./pages/patient/MyPrescriptions";

function AppContent() {
  const location = useLocation();

  //Pages where Navbar should Not show

  const hideNavbar = ["/", "/login", "/register"];
  const showLayout = !hideNavbar.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {showLayout && <Navbar />}
      <Routes>
        <Route path="/test" element={<PDFTest/>} />
      </Routes>
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
          <Route path="/patient/payments" element={<div>My Payments</div>} />
          <Route
            path="/doctor/dashboard"
            element={<div>Doctor Dashboard</div>}
          />
          <Route path="/doctor/profile" element={<div>Doctor Profile</div>} />
          <Route path="/doctor/slots" element={<div>Add Slots</div>} />
          <Route
            path="/doctor/appointments"
            element={<div>Doctor Appointment</div>}
          />
          <Route
            path="/doctor/prescriptions"
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
