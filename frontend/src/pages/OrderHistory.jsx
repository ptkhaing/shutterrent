import React, { useEffect, useState } from 'react';
import api from '../api';

function OrderHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ visible: false, bookingId: null });

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/bookings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching order history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setConfirmModal({ visible: false, bookingId: null });
      setBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setConfirmModal({ visible: false, bookingId: null });
    }
  };

  return (
    <div className="p-8 py-12 relative max-w-3xl mx-auto">
      <h2 className="font-display text-2xl sm:text-3xl mb-8 text-center text-ink-800">My Booking History</h2>
      {loading ? (
        <p className="text-center text-ink-400">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-ink-400">You have no past bookings.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border border-ink-200 rounded-lg p-5 bg-white">
              <h3 className="text-lg font-semibold mb-2 text-ink-800">{booking.listing?.title}</h3>
              <p><span className="font-medium">From:</span> {new Date(booking.startDate).toLocaleDateString()}</p>
              <p><span className="font-medium">To:</span> {new Date(booking.endDate).toLocaleDateString()}</p>
              <p className="text-ink-500 text-sm mt-2">{booking.listing?.description}</p>
              <p className="text-ink-800 font-semibold mt-2">{booking.listing?.pricePerDay.toLocaleString()} Ks per day</p>
              <p><span className="font-medium">Status:</span>{" "}
                <span className={
                  booking.status === "Confirmed"
                    ? "text-green-600 font-semibold"
                    : "text-ink-500 font-semibold"
                }>
                  {booking.status}
                </span>
              </p>
              <p><span className="font-medium">Payment:</span> {booking.paymentMethod || "Cash on Delivery"}</p>
              <button
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors duration-200 text-sm font-semibold"
                onClick={() => setConfirmModal({ visible: true, bookingId: booking._id })}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}

      {confirmModal.visible && (
        <div className="fixed inset-0 bg-ink-900/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="font-display text-lg mb-4 text-ink-800">Cancel Booking?</h2>
            <p className="text-ink-600 mb-6 text-sm">Are you sure you want to cancel this booking?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-ink-100 text-ink-700 rounded-full hover:bg-ink-200 transition-colors duration-200"
                onClick={() => setConfirmModal({ visible: false, bookingId: null })}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                onClick={() => handleCancel(confirmModal.bookingId)}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;