import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDoctors, getDoctorsBySpecialization } from "../../api/doctorApi";
import { bookAppointment } from "../../api/appointmentApi";
import type { DoctorResponse, SlotResponse } from "../../types/doctor.types";

function DoctorSearch() {
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);

  const [specialization, setSpecialization] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [notes, setNotes] = useState('')

  //which doctor's slots are showing
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  //booking confirmation modal
  const [selectedSlot, setSelectedSlot] = useState<SlotResponse | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorResponse | null>(
    null,
  );
  const [bookingLoading, setBookingLoading] = useState(false);
  const[hasSearched, setHasSearched] = useState(false)
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  async function handleSearch() {
    if (!specialization.trim()) {
      setError("Please enter a specialization");
      setDoctors([])
      setSelectedDoctorId(null)
      setHasSearched(false)
      return;
    }
    setLoading(true);
    setHasSearched(true)
    setError('');
    try {
      const doctors = await getDoctorsBySpecialization(specialization);
      setDoctors(doctors);
    } catch (err) {
      setError("Failed to fetch doctors!");
    } finally {
      setLoading(false);
    }
  }

  async function handleShowAll() {
    setLoading(true);
    setError("");
    setSpecialization("");
    setHasSearched(true)
    try {
      const doctors = await getAllDoctors();
      setDoctors(doctors);
    } catch (error) {
      setError("Failed to fetch doctors!");
    } finally {
      setLoading(false);
    }
  }

  function handleViewSlots(doctorId: number) {
    //Toggle slots - click same doctor -> collapse
    if (selectedDoctorId === doctorId) {
      setSelectedDoctorId(null);
    } else {
      setSelectedDoctorId(doctorId);
    }
  }

  function handleSlotClick(slot: SlotResponse, doctor: DoctorResponse) {
    if (slot.booked) return; // ignore booked slots
    setSelectedSlot(slot);
    setSelectedDoctor(doctor);
  }

  async function handleConfirmBooking() {
    if (!selectedSlot || !selectedDoctor) return;
    setBookingLoading(true);
    try {
      await bookAppointment({
        doctorId: selectedDoctor.id,
        slotId: selectedSlot.id,
        notes: notes,
      });
      setSuccessMessage(`Appointment booked with Dr. ${selectedDoctor.name}!`);
      setSelectedSlot(null);
      setSelectedDoctor(null);
      setNotes('')
      //Navigate to appointments after 2 seconds
      setTimeout(() => navigate("/patient/appointments"), 2000);
    } catch (err) {
      setError("Booking failed! Please try again.");
      setSelectedSlot(null);
    } finally {
      setBookingLoading(false);
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
      {/** Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Find Doctors</h1>
        <p className="text-gray-500 mt-1">
          Search by specialization or view all doctors
        </p>
      </div>
      {/** Search Bar */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter specialization (e.g. Cardiology, Dentist...)"
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            🔍 Search
          </button>
          <button
            onClick={handleShowAll}
            disabled={loading}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Show All
          </button>
        </div>
      </div>

      {/** Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/** Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-600 p3 rounded-lg mb-4">
          {successMessage}
        </div>
      )}

      {/** Loading */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading Doctors...</p>
        </div>
      )}

      {/** Show 'No Doctors found' when not loading and Doctors Array is Empty and User has searched */}

      {!loading && hasSearched && doctors.length === 0 && (
        <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-400 text-xl">😔 No doctors found!</p>
            <p className="text-gray-400 mt-2">Try a different specialization</p>
        </div>
      )}

      {/** Doctor Cards */}
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl shadow">
            {/** Doctor Info */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  👨‍⚕️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {" "}
                    Dr. {doctor.name}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {doctor.specialization}
                  </p>
                  <div className="flex gap-4 mt-1">
                    <span className="text-gray-500 text-sm">
                      🎓 {doctor.experience} years exp
                    </span>
                    <span className="text-gray-500 text-sm">
                      📍 {doctor.location}
                    </span>
                    <span className="text-green-600 text-sm font-semibold">
                      💰 ₹{doctor.consultationFee}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleViewSlots(doctor.id)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {selectedDoctorId === doctor.id
                  ? "Hide Slots ▲"
                  : "View Slots ▼"}
              </button>
            </div>
            {/** Slot Selection */}
            {selectedDoctorId === doctor.id && (
              <div className="border-t p-6">
                <h4 className="font-semibold text-gray-700 mb-4">
                  Available Slots:{" "}
                </h4>

                {doctor.slots && doctor.slots.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {doctor.slots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotClick(slot, doctor)}
                        disabled={slot.booked}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors
                                        ${
                                          slot.booked
                                            ? "bg-red-100 text-red-500 cursor-not-allowed"
                                            : "bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer"
                                        }`}
                      >
                        {formatDate(slot.dateTime)}
                        {slot.booked ? " ❌" : " ✅"}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No Slots Available!</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/** Booking Confirmation Modal */}
      {selectedSlot && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Confirm Booking
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-600">
                <span className="font-semibold">Doctor:</span> Dr. {selectedDoctor.name}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">
                  Specialization: {selectedDoctor.specialization}
                </span>
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">Date & Time:</span>{formatDate(selectedSlot.dateTime)}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">Consultation Fee:</span> ₹{selectedDoctor.consultationFee}
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                📝 Symptoms / Notes 
                <span className="text-gray-400 font-normal ml-1">(Optional)</span>
              </label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe your symptoms or reason for visit..."
                rows={3} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none"/>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSelectedSlot(null);
                  setSelectedDoctor(null);
                  setNotes('');
                }}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorSearch;
