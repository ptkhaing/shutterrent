import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { resolveImageSrc } from '../utils/image';

function Listings() {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchListings();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/listings/categories');
      setCategories(res.data);
    } catch (err) {
      console.log('Failed to fetch categories');
    }
  };

  const fetchListings = async (category = '') => {
    setLoading(true);
    try {
      const res = await api.get('/listings', {
        params: category ? { category } : {},
      });
      setListings(res.data);
    } catch (err) {
      console.log('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchListings(category);
  };

  const handleBookClick = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate(`/book/${id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      <h2 className="font-display text-3xl sm:text-4xl text-center mb-2 text-ink-800">Browse Gear</h2>
      <p className="text-center text-ink-500 mb-10">Cameras, lenses and lighting, ready to rent by the day.</p>

      <div className="mb-10 flex gap-3 flex-wrap justify-center">
        <button
          onClick={() => handleCategoryClick('')}
          className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors duration-200 ${
            selectedCategory === ''
              ? 'bg-ink-900 text-white border-ink-900'
              : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors duration-200 ${
              selectedCategory === cat
                ? 'bg-ink-900 text-white border-ink-900'
                : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full h-56 bg-ink-100 rounded-md mb-4" />
              <div className="h-4 bg-ink-100 rounded w-2/3 mb-2" />
              <div className="h-3 bg-ink-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <p className="text-center text-ink-400 py-16">No gear matches this category yet — try another one.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <div key={listing._id} className="group">
              <div className="w-full h-56 bg-white border border-ink-200 rounded-md overflow-hidden mb-4">
                {resolveImageSrc(listing.image) && (
                  <img
                    src={resolveImageSrc(listing.image)}
                    alt={listing.title}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <h3 className="text-lg font-semibold text-ink-800">{listing.title}</h3>
              <p className="text-ink-500 text-sm mt-1 line-clamp-2">{listing.description}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="font-semibold text-ink-800">
                  {listing.pricePerDay.toLocaleString()}<span className="text-ink-400 font-normal text-sm"> Ks / day</span>
                </p>
                <button
                  onClick={() => handleBookClick(listing._id)}
                  className="bg-amber-400 text-ink-900 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-amber-300 transition-colors duration-200"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Listings;