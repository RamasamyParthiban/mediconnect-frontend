import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import type { RootState } from '../store/store'

function Landing() {

  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  // already logged in — send them to their dashboard
  if (isAuthenticated) {
    return role === 'PATIENT'
      ? <Navigate to="/patient/dashboard" />
      : <Navigate to="/doctor/dashboard" />
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-8 py-24 text-center">
          <h1 className="text-5xl font-bold mb-4">🏥 MediConnect</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Book appointments with the right doctor, manage prescriptions,
            and take control of your health — all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Everything you need
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {[
            { icon: '🔍', title: 'Find Doctors', text: 'Search by specialization and compare experience, location and fees.' },
            { icon: '📅', title: 'Book Instantly', text: 'Pick an available slot and book in seconds. Get notified by email.' },
            { icon: '💊', title: 'Digital Prescriptions', text: 'View prescriptions online and download them as a PDF anytime.' },
            { icon: '💳', title: 'Track Payments', text: 'Every consultation payment recorded with a transaction reference.' },
          ].map((f) => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 py-20">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Create an account', text: 'Sign up as a patient in under a minute.' },
              { step: '2', title: 'Find your doctor', text: 'Search specialists and view their available slots.' },
              { step: '3', title: 'Book a slot', text: 'Choose a time, add your symptoms, and confirm.' },
              { step: '4', title: 'Get your prescription', text: 'After your visit, view and download it online.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For doctors */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <div className="bg-blue-50 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            👨‍⚕️ Are you a doctor?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Set up your profile, publish your availability, confirm appointments
            and issue digital prescriptions — all from one dashboard.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Join as a Doctor
          </button>
        </div>
      </section>

      {/* Footer strip */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6">
        <p className="text-sm">
          Copyright © 2026 MediConnect. All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default Landing