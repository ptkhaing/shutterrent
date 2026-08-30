import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { resolveImageSrc } from '../utils/image'

const MS_PER_DAY = 1000 * 60 * 60 * 24

function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [message, setMessage] = useState('')
  const [agree, setAgree] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    api.get(`/listings/${id}`)
      .then(res => setListing(res.data))
      .catch(() => setMessage('Failed to load listing'))
  }, [id, navigate])

  // Nights booked and running total, recalculated whenever the dates change.
  const { nights, total } = useMemo(() => {
    if (!startDate || !endDate || !listing) return { nights: 0, total: 0 }
    const diff = Math.round((new Date(endDate) - new Date(startDate)) / MS_PER_DAY)
    const n = diff > 0 ? diff : 0
    return { nights: n, total: n * listing.pricePerDay }
  }, [startDate, endDate, listing])

  const datesValid = startDate && endDate && nights > 0

  const handleBooking = async () => {
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      await api.post(`/bookings`, {
        listingId: id,
        startDate,
        endDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setShowConfirm(false)
      setMessage('✅ Booking successful!')
      setTimeout(() => navigate('/profile'), 2000)
    } catch (err) {
      setShowConfirm(false)
      setMessage(err.response?.data?.message === 'Booking conflict'
        ? '❌ Those dates are already booked — try a different range.'
        : '❌ Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (!listing) return <p className="text-center mt-12 text-ink-500 dark:text-ink-400">Loading listing...</p>

  return (
    <div className="max-w-xl mx-auto p-6 py-12">
      <h2 className="font-display text-2xl sm:text-3xl mb-6 text-center text-ink-800 dark:text-ink-100">{listing.title}</h2>

      <div className="w-full h-64 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-md overflow-hidden mb-8">
        {resolveImageSrc(listing.image) && (
          <img
            src={resolveImageSrc(listing.image)}
            alt={listing.title}
            className="w-full h-full object-contain p-4"
          />
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!datesValid) {
            setMessage("❌ Please choose a valid date range");
            return;
          }
          if (!agree) {
            setMessage("❌ Please agree to pay on delivery");
            return;
          }
          setMessage('')
          setShowConfirm(true);
        }}
        className="space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-ink-700 dark:text-ink-200">Start Date</label>
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => {
                setStartDate(e.target.value)
                // Keep end date valid if it now falls before the new start date
                if (endDate && e.target.value > endDate) setEndDate('')
              }}
              required
              className="w-full border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-ink-700 dark:text-ink-200">End Date</label>
            <input
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={(e) => setEndDate(e.target.value)}
              required
              disabled={!startDate}
              className="w-full border border-ink-200 dark:border-ink-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-ink-800 disabled:bg-ink-50 dark:disabled:bg-ink-900"
            />
          </div>
        </div>

        {startDate && endDate && !datesValid && (
          <p className="text-sm text-red-600">End date must be after the start date.</p>
        )}

        {datesValid && (
          <div className="rounded-md bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-700 p-4 flex justify-between items-center">
            <span className="text-sm text-ink-600 dark:text-ink-300">
              {nights} night{nights > 1 ? 's' : ''} × {listing.pricePerDay.toLocaleString()} Ks
            </span>
            <span className="font-display text-lg text-ink-800 dark:text-ink-100">{total.toLocaleString()} Ks</span>
          </div>
        )}

        <div>
          <label className="block mb-1 text-sm font-medium text-ink-700 dark:text-ink-200">Payment Method</label>
          <div className="w-full border border-ink-200 dark:border-ink-700 p-2.5 rounded-md bg-ink-50 dark:bg-ink-900 text-ink-600 dark:text-ink-300 text-sm">
            💵 Cash on Delivery (pay when the gear arrives)
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="agree"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="h-4 w-4 accent-amber-500"
          />
          <label htmlFor="agree" className="text-sm text-ink-600 dark:text-ink-300">
            I agree to pay in cash when the item is delivered
          </label>
        </div>

        <button
          type="submit"
          disabled={!datesValid}
          className="bg-amber-400 text-ink-900 font-semibold px-4 py-2.5 rounded-full hover:bg-amber-300 transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review Booking
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-ink-900/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-ink-800 p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h3 className="font-display text-lg mb-3 text-ink-800 dark:text-ink-100">Confirm Booking</h3>
            <p className="text-ink-600 dark:text-ink-300 mb-2 text-sm">
              {nights} night{nights > 1 ? 's' : ''} of <span className="font-medium">{listing.title}</span>
            </p>
            <p className="font-display text-2xl mb-6 text-ink-800 dark:text-ink-100">{total.toLocaleString()} Ks</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-ink-100 dark:bg-ink-700 text-ink-700 dark:text-ink-200 px-4 py-2 rounded-full hover:bg-ink-200 dark:hover:bg-ink-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={submitting}
                className="bg-amber-400 text-ink-900 font-semibold px-4 py-2 rounded-full hover:bg-amber-300 transition-colors duration-200 disabled:opacity-50"
              >
                {submitting ? 'Booking…' : 'Yes, Book Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`mt-4 text-center px-4 py-2 rounded-md text-sm ${
            message.includes("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}

export default Booking
