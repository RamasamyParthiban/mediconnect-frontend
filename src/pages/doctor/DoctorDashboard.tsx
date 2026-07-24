import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { AppointmentResponse } from "../../types/appointment.types";
import type { DoctorResponse } from "../../types/doctor.types";
import {
  getDoctorAppointments,
  confirmAppointment,
  completeAppointment,
  cancelAppointment,
} from "../../api/appointmentApi";
import { getDoctorByUserId } from "../../api/doctorApi";
import axios from "axios";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [doctorProfile, setDoctorProfile] = useState<DoctorResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<{
    id: number;
    action: string;
  } | null>(null);

  const name = useSelector((state: RootState) => state.auth.name);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      //Fetch the appointments and profile in parellel
      const [appointmentData] = await Promise.all([getDoctorAppointments()]);

      const sorted = appointmentData.sort(
        (a, b) => new Date(b.booksAt).getTime() - new Date(a.booksAt).getTime(),
      );
      setAppointments(sorted);

      //fetchDoctorProfile using userID
      if (userId) {
        try {
          const profile = await getDoctorByUserId(userId);
          setDoctorProfile(profile);
        } catch {
          //No Profile yet, -> show warning
          setDoctorProfile(null);
        }
      }
    } catch (error) {
      setError("Failed to Fetch data!");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(appointmentId: number) {
    setActionLoading({ id: appointmentId, action: "confirm" });

    try {
      await confirmAppointment(appointmentId);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, appointmentStatus: "CONFIRMED" } : a,
        ),
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "Failed to Confirm!");
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleComplete(appointmentId: number) {
    setActionLoading({ id: appointmentId, action: "confirm" });
    try {
      await completeAppointment(appointmentId);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, appointmentStatus: "COMPLETED" } : a,
        ),
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "Failed to Complete!");
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancel(appointmentId: number) {
    setActionLoading({ id: appointmentId, action: "cancel" });
    try {
      await cancelAppointment(appointmentId);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, appointmentStatus: "CANCELLED" } : a,
        ),
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "Failed to Cancel!");
      }
    } finally {
      setActionLoading(null);
    }
  }

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (a) => a.appointmentStatus === "PENDING",
  ).length;

  const completedAppointments = appointments.filter(
    (a) => a.appointmentStatus === "COMPLETED",
  ).length;

  function getStatusColor(status: string) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getBorderColor(status: string) {
    switch (status) {
      case "PENDING":
        return "border-yellow-400";
      case "CONFIRMED":
        return "border-blue-400";
      case "COMPLETED":
        return "border-green-400";
      case "CANCELLED":
        return "border-red-400";
      default:
        return "border-gray-300";
    }
  }
  function formatDate(dateString: string) {
    if (!dateString) return "N/A";
    const date = new Date(dateString.slice(0, 23));
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome Dr.{name} 👨‍⚕️
        </h1>
        <p className="text-gray-500 mt-1">Here's your practice summary</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Profile Section */}
      {doctorProfile ? (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                👨‍⚕️
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Dr. {doctorProfile.name}
                </h2>
                <p className="text-blue-600 font-medium">
                  {doctorProfile.specialization}
                </p>
                <div className="flex gap-4 mt-1">
                  <span className="text-gray-500 text-sm">
                    📍 {doctorProfile.location}
                  </span>
                  <span className="text-gray-500 text-sm">
                    🎓 {doctorProfile.experience} Years
                  </span>
                  <span className="text-green-600 text-sm font-semibold">
                    💰 ₹{doctorProfile.consultationFee}/Visit
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/doctor/profile")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-semibold text-lg">
                ⚠️ Complete your profile!
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Patients cant's find you without a profile. Set up your profile
                to start receiving appointments!
              </p>
            </div>
            <button
              onClick={() => navigate("/doctor/profile")}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
            >
              Complete Profile →
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div
          onClick={() => navigate("/doctor/appointments")}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500"
        >
          <p className="text-gray-500 text-sm">Total Appointments</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {totalAppointments}
          </p>
          <p className="text-gray-400 text-sm mt-2">Click to view all</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Pending Confirmation</p>
          <p className="text-4xl font-bold text-yellow-600 mt-2">
            {pendingAppointments}
          </p>
          <p className="text-gray-400 text-sm mt-2">Needs your action!</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6  border-l-4 border-green-600">
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {completedAppointments}
          </p>
          <p className="text-gray-400 text-sm mt-2">Successful visits</p>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No Appointments yet!</p>
        ) : (
          <div className="space-y-4">
            {appointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment.id}
                className={`bg-gray-50 rounded-lg p-4 border-l-4 ${getBorderColor(appointment.appointmentStatus)}`}
              >
                {/* Appointment Info*/}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Patient #{appointment.patientId}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      📅 {formatDate(appointment.booksAt)}
                    </p>
                    {appointment.notes && (
                      <p className="text-gray-500 text-sm mt-1">
                        📝 {appointment.notes}
                      </p>
                    )}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(appointment.appointmentStatus)}`}
                  >
                    {appointment.appointmentStatus}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {/* Confirm - PENDING Only */}
                  {appointment.appointmentStatus === "PENDING" && (
                    <button
                      onClick={() => handleConfirm(appointment.id)}
                      disabled={
                        actionLoading?.id === appointment.id &&
                        actionLoading?.action === "confirm"
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      {actionLoading?.id === appointment.id &&
                      actionLoading?.action === "confirm"
                        ? "Confirming..."
                        : "✅ Confirm"}
                    </button>
                  )}

                  {/* Complete - CONFIRMED only  */}
                  {appointment.appointmentStatus === "CONFIRMED" && (
                    <button
                      onClick={() => handleComplete(appointment.id)}
                      disabled={
                        actionLoading?.id === appointment.id &&
                        actionLoading?.action === "complete"
                      }
                      className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      {actionLoading?.id === appointment.id &&
                      actionLoading?.action === "complete"
                        ? "Completing..."
                        : "🏁 Complete"}
                    </button>
                  )}

                  {/* Write Prescription - COMPLETED only */}
                  {appointment.appointmentStatus === "COMPLETED" && (
                    <button
                      onClick={() => navigate("/doctor/prescription")}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      💊 Write Prescription
                    </button>
                  )}

                  {/* Cancel - PENDING or CONFIRMED */}
                  {(appointment.appointmentStatus === "PENDING" ||
                    appointment.appointmentStatus === "CONFIRMED") && (
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      disabled={
                        actionLoading?.id === appointment.id &&
                        actionLoading?.action === "cancel"
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      {actionLoading?.id === appointment.id &&
                      actionLoading?.action === "cancel"
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
