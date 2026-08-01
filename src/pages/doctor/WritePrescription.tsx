import { useEffect, useState } from "react";
import type { AppointmentResponse } from "../../types/appointment.types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getDoctorAppointments } from "../../api/appointmentApi";
import { savePrescription } from "../../api/prescriptionApi";
import axios from "axios";

function WritePrescription() {
  const [completedAppointment, setCompletedAppointments] = useState<
    AppointmentResponse[]
  >([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [instructions, setInstructions] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const data = await getDoctorAppointments();

      const completed = data.filter((a) => a.appointmentStatus === "COMPLETED");

      setCompletedAppointments(completed);

      //if we arrived with ?appointmentId=5, pre-select it
      const idFromUrl = searchParams.get("appointmentId");
      console.log("id from URL", idFromUrl);
      if (idFromUrl) {
        setSelectedAppointmentId(Number(idFromUrl));
      }
    } catch (error) {
      setError("Failed to load appointments!");
    } finally {
      setLoading(false);
    }
  }

  function handleAddMedicine() {
    setMedicines((prev) => [
      ...prev,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  }

  function handleRemoveMedicine(index: number) {
    if (medicines.length === 1) return; // always keep at least one row
    setMedicines((prev) => prev.filter((_, i) => i != index));
  }

  function handleMedicineChange(index: number, field: string, value: string) {
    setMedicines((prev) =>
      prev.map((medicine, i) =>
        i === index ? { ...medicine, [field]: value } : medicine,
      ),
    );
  }

  async function handleSubmit() {
    if (!selectedAppointmentId) {
      setError("Please select an appointment!");
      return;
    }

    const validMedicines = medicines.filter((m) => m.name.trim());

    if (validMedicines.length === 0) {
      setError("Add at least one medicine with a name!");
      return;
    }

    for (const m of validMedicines) {
      if (!m.dosage.trim() || !m.frequency.trim() || !m.duration.trim()) {
        setError(`Please fill all fields for "${m.name.trim()}"`);
        return;
      }
    }

    if (!instructions.trim()) {
      setError("Instructions are required!");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await savePrescription({
        appointmentId: selectedAppointmentId,
        medicines: validMedicines,
        instructions: instructions,
      });

      setSuccess("Prescription saved successfully!");

      setTimeout(() => navigate("/doctor/appointments"), 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "Failed to save prescriptions!");
      }
    } finally {
      setSaving(false);
    }
  }

  function formatDate(dateString: string) {
    if (!dateString) return "N/A";
    const date = new Date(dateString.slice(0, 23));
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "numeric",
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

  //No Completed Appointments - Nothing to prescribe for
  if (completedAppointment.length === 0) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-2xl mx-auto text-center">
          <p className="text-yellow-800 font-semibold text-lg mb-2">
            No Completed Appointments
          </p>
          <p className="text-yellow-700 mb-4">
            You can only write prescriptions for appoitments you've marked as
            completed
          </p>
          <button
            onClick={() => navigate("/doctor/appointments")}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
          >
            View Appointments →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Write Prescription</h1>
        <p className="text-gray-500 mt-1">
          Create a prescription for a completed appointment
        </p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 max-w-4xl mx-auto">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4 max-w-4xl mx-auto">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-8 max-w-4xl mx-auto">
        {/* Appointment Selector */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Select Appointment
          </label>

          <select
            value={selectedAppointmentId ?? ""}
            onChange={(e) =>
              setSelectedAppointmentId(
                e.target.value ? Number(e.target.value) : null,
              )
            }
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          >
            <option value="">-- Choose an appointment --</option>
            {completedAppointment.map((a) => (
              <option key={a.id} value={a.id}>
                Appointment #{a.id} - {formatDate(a.bookedAt)}
              </option>
            ))}
          </select>
        </div>
        {selectedAppointmentId ? (
          <>
            {/* Medicines - the dynamic list */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-gray-700 font-medium">
                  Medicines ({medicines.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  + Add Medicine
                </button>
              </div>

              <div className="space-y-3">
                {medicines.map((medicine, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600 text-sm font-medium">
                        Medicine {index + 1}
                      </span>
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicine(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <input
                        type="text"
                        value={medicine.name}
                        onChange={(e) =>
                          handleMedicineChange(index, "name", e.target.value)
                        }
                        placeholder="Medicine name"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                      />

                      <input
                        type="text"
                        value={medicine.dosage}
                        onChange={(e) =>
                          handleMedicineChange(index, "dosage", e.target.value)
                        }
                        placeholder="Dosage (500mg)"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                      />

                      <input
                        type="text"
                        value={medicine.frequency}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "frequency",
                            e.target.value,
                          )
                        }
                        placeholder="Frequency"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={medicine.duration}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "duration",
                            e.target.value,
                          )
                        }
                        placeholder="Duration 5 days"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Instructions */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Instructions
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Take after food, drink plenty of water..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none"
              ></textarea>
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full bg-blue-600 py-3 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {saving ? "Saving..." : "Save Prescription"}
            </button>
          </>
        ) : (
          <p>Select an appointment above to start writting prescription</p>
        )}
      </div>
    </div>
  );
}

export default WritePrescription;
