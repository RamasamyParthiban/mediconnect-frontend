import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";
import { logout } from "../store/authSlice";

function Navbar() {
  const name = useSelector((state: RootState) => state.auth.name);
  const role = useSelector((state: RootState) => state.auth.role);

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex items-center justify-between">
      {/** Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        🏥 MediConnect
      </Link>

      {/** Navigation Links */}
      <div className="flex gap-6">
        {role === "PATIENT" ? (
          <>
            <Link
              to="/patient/dashboard"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Patient Dashboard
            </Link>
            <Link
              to="/patient/doctors"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Find Doctors
            </Link>
            <Link
              to="/patient/appointments"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Appointments
            </Link>

            <Link
              to="/patient/prescriptions"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Prescriptions
            </Link>
            <Link
              to="/patient/payments"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Payments
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/doctor/dashboard"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Doctor Dashboard
            </Link>
            <Link
              to="/doctor/profile"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Profile
            </Link>
            <Link
              to="/doctor/slots"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Manage Slots
            </Link>

            <Link
              to="/doctor/appointments"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Appointments
            </Link>
            <Link
              to="/doctor/prescription"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Write Prescription
            </Link>
          </>
        )}
      </div>
      {/** User info + Logout */}
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium"> Hi, {name}!</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
