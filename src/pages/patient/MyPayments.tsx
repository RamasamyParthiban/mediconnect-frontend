import { useState, useEffect } from "react";
import { getPaymentHistory } from "../../api/paymentApi";
import { getDoctorById } from "../../api/doctorApi";
import type { PaymentResponse } from "../../types/payment.types";

function MyPayments() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [doctorNames, setDoctorNames] = useState<{ [key: number]: string }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await getPaymentHistory();

      //Sort by most recent first!
      const sorted = data.sort(
        (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
      );

      setPayments(sorted);

      //Fetch doctor names
      const doctorNamesMap: { [key: number]: string } = {};

      for (const payment of sorted) {
        if (!doctorNamesMap[payment.doctorId]) {
          try {
            const doctor = await getDoctorById(payment.doctorId);
            doctorNamesMap[payment.doctorId] = doctor.name;
          } catch {
            doctorNamesMap[payment.doctorId] = "Unknown Doctor";
          }
        }
      }

      setDoctorNames(doctorNamesMap);
    } catch (error) {
      setError("Failed to fetch the payments!");
    } finally {
      setLoading(false);
    }
  }

  //Copy Transaction ID to Clipboard
  async function handleCopy(transactionId: string) {
    await navigator.clipboard.writeText(transactionId);
    setCopiedId(transactionId);
    setTimeout(() => setCopiedId(null), 2000); //reset afer 2 seconds
  }
  //Stats Calculations
  const totalSpent = payments
    .filter((p) => p.paymentStatus === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPayments = payments.length;

  const lastPayment =
    payments.length > 0 ? formatDate(payments[0].paidAt) : "No payments yet";

  //Payment Method Breakdown
  const cardTotal = payments
    .filter((p) => p.paymentMethod === "CARD" && p.paymentStatus === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const upiTotal = payments
    .filter((p) => p.paymentMethod === "UPI" && p.paymentStatus === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const cashTotal = payments
    .filter((p) => p.paymentMethod === "CASH" && p.paymentStatus === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  function getStatusColor(status: string) {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getPaymentMethodIcon(method: string) {
    switch (method) {
      case "CARD":
        return "💳";
      case "UPI":
        return "📱";
      case "CASH":
        return "💵";
      default:
        return "💰";
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
        <p className="text-gray-500 text-xl">Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50">
      {/** Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Payments</h1>
        <p className="text-gray-500 mt-1">Track your payment history</p>
      </div>

      {/** Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/** Status Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Total Spent */}
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{totalSpent}</p>
          <p className="text-gray-400 text-sm mt-2">Successful payments only</p>
        </div>

        {/* Total Payment */}
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Total Payments</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {totalPayments}
          </p>
          <p className="text-gray-400 text-sm">All Transactions</p>
        </div>

        {/* Last Payment */}
        <div className="bg-white rounded-xl p-6 shadow border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm">Last Payment</p>
          <p className="text-lg font-bold text-purple-600 mt-2">
            {lastPayment}
          </p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Payment Method Breakdown
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl mb-2">💳</p>
            <p className="font-semibold text-gray-700">Card</p>
            <p className="text-blue-600 font-bold">₹{cardTotal}</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl mb-2">📱</p>
            <p className="font-semibold text-gray-700">UPI</p>
            <p className="text-blue-600 font-bold">₹{upiTotal}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl mb-2">💵</p>
            <p className="font-semibold text-gray-700">Cash</p>
            <p className="text-blue-600 font-bold">₹{cashTotal}</p>
          </div>
        </div>
      </div>
      {/* Payment List */}
      {payments.length === 0 ? (
        <div className="bg-gray-50 rounded-xl shadow p-12 text-center">
          <p className="text-gray-400 text-xl mb-2">💳 No payments yet!</p>
          <p className="text-gray-400">Your payment history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="bg-white rounded-xl shadow p-6">
              {/* Payment Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Dr. {doctorNames[payment.doctorId] || "Loading..."}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    📅 {formatDate(payment.paidAt)}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Appointment #{payment.appointmentId}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold shrink-0 ml-4 ${getStatusColor(payment.paymentStatus)}`}
                >
                  {payment.paymentStatus}
                </span>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-gray-500 text-sm">Amount</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">
                    ₹{payment.amount}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Payment Method</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {" "}
                    {getPaymentMethodIcon(payment.paymentMethod)}{" "}
                    {payment.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Transaction ID</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-800 text-sm font-medium">
                      {payment.transactionId.slice(0, 8)}...
                    </p>
                    <button
                      onClick={() => handleCopy(payment.transactionId)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                    >
                      {copiedId === payment.transactionId
                        ? "✅ Copied!"
                        : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPayments;
