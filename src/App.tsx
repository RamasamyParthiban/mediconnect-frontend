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
import DoctorProfile from "./pages/doctor/DoctorProfile";
import ManageSlots from "./pages/doctor/ManageSlots";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import WritePrescription from "./pages/doctor/WritePrescription";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";

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
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRole="PATIENT">
                <PatientDashboard />{" "}
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/doctors"
            element={
              <ProtectedRoute allowedRole="PATIENT">
                <DoctorSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute allowedRole="PATIENT">
                <MyAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/prescriptions"
            element={
              <ProtectedRoute allowedRole="PATIENT">
                <MyPrescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/payments"
            element={
              <ProtectedRoute allowedRole="PATIENT">
                <MyPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRole="DOCTOR">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <ProtectedRoute allowedRole="DOCTOR">
                <DoctorProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/doctor/slots" element={<ManageSlots />} />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRole="DOCTOR">
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescription"
            element={
              <ProtectedRoute allowedRole="DOCTOR">
                <WritePrescription />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<div>About Us</div>} />
          <Route path="/contact" element={<div>Contact Us</div>} />
          <Route path="/terms" element={<div>Terms and Condition</div>} />
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
