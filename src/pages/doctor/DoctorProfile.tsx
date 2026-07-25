import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import {
  getDoctorByUserId,
  registerDoctor,
  updateDoctorProfile,
} from "../../api/doctorApi";
import axios from "axios";

function DoctorProfile() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "",
    experience: "",
    bio: "",
    consultationFee: "",
    location: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = useSelector((state: RootState) => state.auth.userId);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const profile = await getDoctorByUserId(userId);

      //Profile Exists! Pre-fill form and set Edit mode!
      setFormData({
        name: profile.name,
        phone: profile.phone.toString(),
        specialization: profile.specialization,
        experience: profile.experience.toString(),
        bio: profile.bio,
        consultationFee: profile.consultationFee.toString(),
        location: profile.location,
      });

      setIsEditMode(true);
    } catch (error) {
      //No profile yet - Create Mode
      setIsEditMode(false);
    } finally {
      setLoading(false);
    }
  }

  function validateForm(): string | null {
    if (!formData.name.trim()) return "Name is Required!";
    if (!formData.phone.trim()) return "Phone number is required!";
    if (formData.phone.length !== 10) return "Phone number must be 10 digits!";
    if (!formData.specialization.trim()) return "Specialization is required!";
    if (!formData.experience.trim()) return "Experience is required!";
    if (Number(formData.experience) < 0)
      return "Experience cannot be negative!";
    if (!formData.bio.trim()) return "Bio is required!";
    if (!formData.consultationFee.trim())
      return "Consultation fee is required!";
    if (Number(formData.consultationFee) <= 0)
      return "Consultation fee must be greater than 0!";
    if (!formData.location.trim()) return "Location is required!";

    return null; //no errors
  }

  async function handleSubmit() {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: formData.name,
        phone: Number(formData.phone),
        specialization: formData.specialization,
        experience: Number(formData.experience),
        bio: formData.bio,
        consultationFee: Number(formData.consultationFee),
        location: formData.location,
      };

      if (isEditMode) {
        await updateDoctorProfile(payload);
        setSuccess("Profile updated successfully!");
      } else {
        await registerDoctor(payload);
        setSuccess("Profile created successfully!");
        setIsEditMode(true); //now switch to edit mode
      }

      //Redirect to Dashboard after 2 seconds
      setTimeout(() => navigate("/doctor/dashboard"), 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "Failed to Save profile");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex">
      {/* LEFT — blue banner, half the screen */}
      <div
        className="w-1/2 bg-gradient-to-br from-blue-400 to-blue-600
                    flex flex-col items-center justify-center p-12 text-white"
      >
        <div className="text-8xl mb-6">🩺</div>
        <h3 className="text-3xl font-bold text-center">
          {isEditMode ? "Keep Your Profile Updated" : "Welcome to MediConnect!"}
        </h3>
        <p className="text-blue-100 text-center mt-3 text-lg">
          {isEditMode
            ? "Accurate information helps patients trust you"
            : "Complete your profile to start receiving appointments"}
        </p>
      </div>

      {/* RIGHT — form, half the screen, scrollable */}
      <div className="w-1/2 flex items-center justify-center p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isEditMode ? "Edit Profile" : "Create Your Profile"}
          </h1>
          <p className="text-gray-500 mb-8">
            {isEditMode
              ? "Update your professional information"
              : "Set up your profile so patients can find you!"}
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Name */}

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Dr. John Doe"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="9876543210"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Specialization */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Specialization
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
              placeholder="e.g. Cardiology, ENT, Dermatology"
              className="border w-full rounded-lg border-gray-300 p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Experience and Fee - side by side */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Experience (years)
              </label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                placeholder="5"
                className="border w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                value={formData.consultationFee}
                onChange={(e) =>
                  setFormData({ ...formData, consultationFee: e.target.value })
                }
                placeholder="1000"
                className="border w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
          {/* Location */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Velachery, Chennai."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell patients about your experience and expertise..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Profile"
                : "Create Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
