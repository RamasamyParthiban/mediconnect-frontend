import { useState, useEffect } from "react";
import type { AppointmentResponse } from "../../types/appointment.types";
import type { PrescriptionResponse } from "../../types/prescription.types";
import type { PaymentResponse } from "../../types/payment.types";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { getPatientAppointments } from "../../api/appointmentApi";
import { getPatientPrescriptions } from "../../api/prescriptionApi";
import { getPaymentHistory } from "../../api/paymentApi";

function PatientDashboard() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponse[]>(
    [],
  );

  const [payments, setPayments] = useState<PaymentResponse[]>([]);

  const [loading, setLoading] = useState(true);

  const name = useSelector((state: RootState) => state.auth.name);

  const navigate = useNavigate();

  const totalAppointments = appointments.length;

  const cancelledAppointments = appointments.filter(
    (a) => a.appointmentStatus === "CANCELLED",
  ).length;

  const activeAppointments = totalAppointments - cancelledAppointments;

  const totalPrescriptions = prescriptions.length;

  const totalPayments = payments.filter(p => p.paymentStatus==='SUCCESS').reduce((sum, p) => sum + p.amount, 0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [appointmentsData, prescriptionsData, paymentsData] =
        await Promise.all([
          getPatientAppointments(),
          getPatientPrescriptions(),
          getPaymentHistory(),
        ]);
      setAppointments(appointmentsData);
      setPrescriptions(prescriptionsData);
      setPayments(paymentsData);
    } catch (error) {
      console.log("Failed to fetch date", error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {

    if (!dateString) return "N/A";

    // Keep only first 23 chars → "2026-06-21T01:15:46.768"
    const trimmed = dateString.slice(0, 23);

    const date = new Date(trimmed);

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
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50">
      {/** Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your health summary</p>
      </div>

      {/** Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/** Total Appointments */}
        <div
          onClick={() => navigate("/patient/appointments")}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500"
        >
          <p className="text-gray-500 text-sm">Total Appointments</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {totalAppointments}
          </p>
          <p className="text-green-500 text-sm mt-2">
            ✅ Active:{activeAppointments}
          </p>
          <p className="text-red-500 text-sm">
            ❌ Cancelled: {cancelledAppointments}
          </p>
        </div>
        {/** Total Prescriptions */}
        <div
          onClick={() => navigate("/patient/prescriptions")}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-green-500"
        >
          <p className="text-gray-500 text-sm">Total Prescriptions</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {totalPrescriptions}
          </p>
          <p className="text-gray-400 text-sm mt-2">💊 Click to view all</p>
        </div>
        {/* Total Payments */}
        <div
          onClick={() => navigate("/patient/payments")}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-purple-500"
        >
          <p className="text-gray-500 text-sm">Total Spent</p>
          <p className="text-4xl font-bold text-purple-600 mt-2">
            ₹{totalPayments}
          </p>
          <p className="text-gray-400 text-sm mt-2">💳 Click to view history</p>
        </div>

        {/* Find Doctors */}
        <div
          onClick={() => navigate("/patient/doctors")}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-orange-500"
        >
          <p className="text-gray-500 text-sm">Find Doctors</p>
          <p className="text-4xl mt-2">🔍</p>
          <p className="text-gray-400 text-sm mt-2">Search by specialization</p>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No appointments yet.
            <span
              onClick={() => navigate("/patient/doctors")}
              className="text-blue-500 cursor-pointer hover:underline ml-1"
            >
              Find a doctor!
            </span>
          </p>
        ) : (
          <div className="space-y-3">
            {appointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    Appointment #{appointment.id}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    🕐 Appointment: {formatDate(appointment.appointmentDateTime)}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                   📅 Bookd on {formatDate(appointment.bookedAt)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                ${
                  appointment.appointmentStatus === "CANCELLED"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
                >
                  {appointment.appointmentStatus}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
