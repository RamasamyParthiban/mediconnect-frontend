import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { SlotResponse } from "../../types/doctor.types";
import type { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import {
  addSlot,
  deleteSlot,
  getAllSlots,
  getDoctorByUserId,
} from "../../api/doctorApi";


function ManageSlots() {
  const [slots, setSlots] = useState<SlotResponse[]>([]);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [hasProfile, setHasProfile] = useState(true);
  const [newSlot, setNewSlot] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = useSelector((state: RootState) => state.auth.userId);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    setTimeout(() => {
        setError('')
        setSuccess('')
    },4000)
  }, [error,success]);

  async function fetchData() {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const doctor = await getDoctorByUserId(userId);

      setDoctorId(doctor.id);
      setHasProfile(true);

      const slotData = await getAllSlots(doctor.id);

      const sorted = slotData.sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
      );

      setSlots(sorted);
    } catch (error) {
      //no profile yet
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSlot() {
    if (!newSlot) {
      setError("Please select a date and time!");
      return
    }

    if (new Date(newSlot) < new Date()) {
      setError("Cannot add a slot in the past!");
      return
    }

    setAdding(true);
    setError("");
    setSuccess("");

    try {
      await addSlot({ dateTime: newSlot });

      setSuccess("Slot added successfully!");
      setNewSlot("");
      //refetch to get the new slot with it's id
      if (doctorId) {
        const slotsData = await getAllSlots(doctorId);
        const sorted = slotsData.sort(
          (a, b) =>
            new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
        );

        setSlots(sorted);
      }
    } catch (err) {
         console.log('Full Error :', err);
      if (axios.isAxiosError(err)) {
        console.log('Response:', err.response);
        console.log('data:',err.response?.data);
        setError(err.response?.data || "Failed to add slot!");
        console.log(err);
      }
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteSlot(slotId: number) {
    setDeletingId(slotId);
    setError("");
    setSuccess("");
    try {
      await deleteSlot(slotId);

      setSlots((prev) => prev.filter((s) => s.id !== slotId));
      setSuccess("Slot deleted successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "Failed to delete slot!");
      }
    } finally {
      setDeletingId(null);
    }
  }

  function formatDateTime(dateString: string) {
    if (!dateString) return "N/A";
    const date = new Date(dateString.slice(0, 23));
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-In", {
      day: "numeric",
      month: "short",
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

  //No profile - prompt to create one first
  if (!hasProfile) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-2xl mx-auto text-center">
          <p className="text-yellow-800 font-semibold text-lg mb-2">
            ⚠️ Create your profile first!
          </p>
          <p className="text-yellow-700 mb-4">
            You need a profile before you can add availability slots.
          </p>
          <button
            onClick={() => navigate("/doctor/profile")}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Slots</h1>
        <p className="text-gray-500 mt-1">Add and manage your availability</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* Add Slot form */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Slot</h2>
        <div className="flex gap-4">
          <input
            type="datetime-local"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddSlot}
            className="bg-blue-600 px-6 py-3 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            {adding ? "Adding..." : "➕ Add Slot"}
          </button>
        </div>
      </div>

      {/* Slots List */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Your Slots ({slots.length})
        </h2>

        {slots.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No slots yet. Add your first availability slot above!</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {slots.map((slot) => (
              <div key={slot.id} className={`rounded-lg p-4 border-l-4 flex items-center justify-between
              ${slot.booked ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'}`}>
                <div >
                  <p className="font-medium text-gray-800">{formatDateTime(slot.dateTime)}</p>
                  <p className={`text-sm mt-1 font-medium ${slot.booked ? 'text-red-600' : 'text-green-600'}`}>{slot.booked ? "🔴 Booked" : "🟢 Available"}</p>
                </div>
                {!slot.booked && (
                  <button onClick={() => handleDeleteSlot(slot.id)}
                  disabled={deletingId === slot.id}
                  className="text-red-500 hover:text-red-700 text-sm font-medium hover:cursor-pointer">
                    {deletingId === slot.id ? "..." : "🗑️ Delete"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageSlots;
