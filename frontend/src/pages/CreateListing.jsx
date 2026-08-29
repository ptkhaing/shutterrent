import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const CATEGORIES = ['DSLR', 'Mirrorless', 'Cinema', 'Lens', 'Lighting', 'Accessory']

function CreateListing() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [pricePerDay, setPricePerDay] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('pricePerDay', pricePerDay)
      formData.append('category', category)
      if (image) formData.append('image', image)

      const token = localStorage.getItem('token')
      await api.post('/listings', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      // Was navigate('/browse'), a route that doesn't exist — listings live at /listings
      navigate('/listings')
    } catch (err) {
      console.error(err)
      setError('Failed to create listing. Make sure you are logged in as an admin.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 py-12">
      <h2 className="font-display text-2xl sm:text-3xl mb-6 text-center text-ink-800">Create a New Listing</h2>

      {error && (
        <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-md py-2 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Camera Title"
          className="w-full border border-ink-200 p-2 rounded-md focus:ring-2 focus:ring-amber-400 focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full border border-ink-200 p-2 rounded-md focus:ring-2 focus:ring-amber-400 focus:outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Price per day (Ks)"
            className="w-full border border-ink-200 p-2 rounded-md focus:ring-2 focus:ring-amber-400 focus:outline-none"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            required
            min="0"
          />

          <select
            className="w-full border border-ink-200 p-2 rounded-md focus:ring-2 focus:ring-amber-400 focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <input
          type="file"
          accept="image/*"
          className="w-full text-sm text-ink-500"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-400 text-ink-900 font-semibold py-2.5 rounded-full hover:bg-amber-300 transition-colors duration-200 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit Listing'}
        </button>
      </form>
    </div>
  )
}

export default CreateListing
