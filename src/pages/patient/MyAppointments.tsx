import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import type { AppointmentResponse } from "../../types/appointment.types";
import {
  getPatientAppointments,
  cancelAppointment,
} from "../../api/appointmentApi";
import { getPaymentByAppointmentId, makePayment } from "../../api/paymentApi";
import { getDoctorById } from "../../api/doctorApi";
import axios from "axios";

function MyAppointments() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paidAppointments, setPaidAppointments] = useState<Set<number>>(
    new Set(),
  );
  const [doctorNames, setDoctorNames] = useState<{ [key: number]: string }>({});
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await getPatientAppointments();

      //sort by most recent first!
      const sorted = data.sort(
        (a, b) => new Date(b.appointmentDateTime).getTime() - new Date(a.appointmentDateTime).getTime(),
      );

      setAppointments(sorted);

      //Fetch Doctor names for all appointments
      const doctorNamesMap: { [key: number]: string } = {};

      for (const appointment of sorted) {
        if (!doctorNamesMap[appointment.doctorId]) {
          try {
            const doctor = await getDoctorById(appointment.doctorId);
            doctorNamesMap[appointment.doctorId] = doctor.name;
          } catch {
            doctorNamesMap[appointment.doctorId] = "Unknown Doctor";
          }
        }
      }
      setDoctorNames(doctorNamesMap);

      //Check which appointments are paid
      const paidSet = new Set<number>();
      for (const appointment of sorted) {
        try {
          await getPaymentByAppointmentId(appointment.id);
          paidSet.add(appointment.id);
        } catch {}
      }
      setPaidAppointments(paidSet);
    } catch (err) {
      setError("Failed to fetch appointments!");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(appointmentId: number) {
    setActionLoading(appointmentId);

    try {
      await cancelAppointment(appointmentId);

      //Update local state - no need to refresh
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, appointmentStatus: "CANCELLED" } : a,
        ),
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "Failed to Cancel");
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handlePayment(appointmentId: number) {
    setActionLoading(appointmentId);
    try {
      await makePayment({
        appointmentId,
        paymentMethod: "UPI",
      });
      //Mark as paid in local state!
      setPaidAppointments((prev) => new Set([...prev, appointmentId]));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "Payment failed!");
      }
    } finally {
      setActionLoading(null);
    }
  }

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
        <p className="text-gray-500 text-xl">Loading appointments...</p>
      </div>
    );
  }
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/** Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        <p className="text-gray-500 mt-1">Manage your appointments</p>
      </div>

      {/** Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/** Empty State */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-gray-400 text-xl mb-4">📅 No Appointments yet!</p>
          <button
            onClick={() => navigate("/patient/doctors")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Find a Doctor
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl shadow p-6"
            >
              {/** Appointment Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Dr. {doctorNames[appointment.doctorId] || "loading..."}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    🕐 Appointment : {formatDate(appointment.appointmentDateTime)}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    📅 Booked on {formatDate(appointment.bookedAt)}
                  </p>
                  {appointment.notes && (
                    <p className="text-gray-500 text-sm mt-1">
                      📝 Notes: {appointment.notes}
                    </p>
                  )}
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(appointment.appointmentStatus)}`}
                >
                  {appointment.appointmentStatus}
                </span>
              </div>
              {/** Action Buttons*/}
              <div className="flex gap-3 mt-4">
                {/** Cancel Button - PENDING or CONFIRMED */}
                {(appointment.appointmentStatus === "PENDING" ||
                  appointment.appointmentStatus === "CONFIRMED") && (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    disabled={actionLoading === appointment.id}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    {actionLoading === appointment.id
                      ? "Cancelling..."
                      : "Cancel"}
                  </button>
                )}

                {/** Pay Now - Confirmed and not paid */}
                {appointment.appointmentStatus === "CONFIRMED" &&
                  !paidAppointments.has(appointment.id) && (
                    <button
                      onClick={() => handlePayment(appointment.id)}
                      disabled={actionLoading === appointment.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      {actionLoading === appointment.id
                        ? "Processing..."
                        : "💳 Pay Now"}
                    </button>
                  )}

                {/** Paid Badge */}
                {paidAppointments.has(appointment.id) && (
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
                    ✅ Paid
                  </span>
                )}

                {/** View Prescription - COMPLETED */}
                {appointment.appointmentStatus === "COMPLETED" && (
                  <button
                  onClick={() => navigate('/patient/prescriptions')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">💊 View Prescription</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAppointments;
