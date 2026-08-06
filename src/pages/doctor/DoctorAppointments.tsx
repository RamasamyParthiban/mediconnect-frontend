import { useEffect, useState } from "react";
import type { AppointmentResponse } from "../../types/appointment.types";
import { useNavigate } from "react-router-dom";
import {
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
  getDoctorAppointments,
} from "../../api/appointmentApi";
import { getUserById } from "../../api/userApi";
import axios from "axios";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [patientNames, setPatientNames] = useState<{ [key: number]: string }>(
    {},
  );
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<{
    id: number;
    action: string;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
   const timer = setTimeout(() => {
      setError('')
    },4000)
  }, [error]);

  async function fetchData() {
    try {
      const data = await getDoctorAppointments();

      const sorted = data.sort(
        (a, b) =>
          new Date(a.appointmentDateTime).getTime() -
          new Date(b.appointmentDateTime).getTime(),
      );
      setAppointments(sorted);

      // Build Patient-names map - one call per unique patient

      const namesMap: { [key: number]: string } = {};
      for (const appointment of sorted) {
        if (!namesMap[appointment.patientId]) {
          try {
            const patient = await getUserById(appointment.patientId);
            namesMap[appointment.patientId] = patient.name;
          } catch {
            namesMap[appointment.patientId] = "Unknown Patient";
          }
        }
      }
      setPatientNames(namesMap);
    } catch (error) {
      setError("Failed to fetch appointments");
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
        setError(error.response?.data || "Failed to confirm!");
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleComplete(appointmentId: number) {
    setActionLoading({ id: appointmentId, action: "complete" });
    try {
      await completeAppointment(appointmentId);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, appointmentStatus: "COMPLETED" } : a,
        ),
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "Failed to complete!");
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
        setError(error.response?.data || "Failed to cancel!");
      }
    } finally {
      setActionLoading(null);
    }
  }

  const filteredAppointments =
    activeFilter === "ALL"
      ? appointments
      : appointments.filter((a) => a.appointmentStatus === activeFilter);

  const counts = {
    ALL: appointments.length,
    PENDING: appointments.filter((a) => a.appointmentStatus === "PENDING")
      .length,
    CONFIRMED: appointments.filter((a) => a.appointmentStatus === "CONFIRMED")
      .length,
    COMPLETED: appointments.filter((a) => a.appointmentStatus === "COMPLETED")
      .length,
    CANCELLED: appointments.filter((a) => a.appointmentStatus === "CANCELLED")
      .length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }

  const tabs = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

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
        return "border-gray-400";
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
        <p className="text-gray-500 mt-1">
          Manage all your patient appointments
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Filter Tabs */}

      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === tab ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()} (
            {counts[tab as keyof typeof counts]})
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-gray-400 text-xl">
            No {activeFilter === "ALL" ? "" : activeFilter.toLowerCase()}{" "}
            appointments
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`bg-white rounded-xl shadow p-6 border-l-4 ${getBorderColor(appointment.appointmentStatus)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {patientNames[appointment.patientId] || "Loading..."}{" "}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    🕐 Appointment:{" "}
                    {formatDate(appointment.appointmentDateTime)}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    📅 Booked on {formatDate(appointment.bookedAt)}
                  </p>
                  {appointment.notes && (
                    <p className="text-gray-500 text-sm mt-1">
                      📝 {appointment.notes}
                    </p>
                  )}
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold shrink-0 ml-4 ${getStatusColor(appointment.appointmentStatus)}`}
                >
                  {appointment.appointmentStatus}
                </span>
              </div>

              <div className="flex gap-3">
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

                {appointment.appointmentStatus === "CONFIRMED" && (
                  <button
                    onClick={() => handleComplete(appointment.id)}
                    disabled={
                      actionLoading?.id === appointment.id &&
                      actionLoading?.action === "complete"
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    {actionLoading?.id === appointment.id &&
                    actionLoading?.action === "complete"
                      ? "Completing..."
                      : "🏁 Complete"}
                  </button>
                )}

                {appointment.appointmentStatus === "COMPLETED" && (
                  <button
                    onClick={() =>
                      navigate(
                        `/doctor/prescription?appointmentId=${appointment.id}`,
                      )
                    }
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    💊 Write Prescription
                  </button>
                )}

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
  );
}

export default DoctorAppointments;
