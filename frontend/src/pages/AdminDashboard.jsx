import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { resolveImageSrc } from "../utils/image";

const CATEGORIES = ['DSLR', 'Mirrorless', 'Cinema', 'Lens', 'Lighting', 'Accessory'];

const emptyForm = { title: '', description: '', pricePerDay: '', category: CATEGORIES[0], image: null };

function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.isAdmin) return navigate("/");

        const [listingsRes, usersRes, bookingsRes] = await Promise.all([
          api.get("/admin/listings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/admin/bookings", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setListings(listingsRes.data);
        setUsers(usersRes.data);
        setBookings(bookingsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("Error loading admin data:", err);
        navigate("/login");
      }
    };

    fetchData();
  }, []);

  const handleDeleteListing = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/admin/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      console.error("Failed to delete listing");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error("Failed to delete user");
    }
  };

  const handleEdit = (listing) => {
    setEditingId(listing._id);
    setForm({
      title: listing.title,
      description: listing.description,
      pricePerDay: listing.pricePerDay,
      category: listing.category || CATEGORIES[0],
      image: null,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("pricePerDay", form.pricePerDay);
    data.append("category", form.category);
    if (form.image) data.append("image", form.image);

    try {
      const res = await api.put(`/admin/listings/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(prev => prev.map(l => l._id === id ? res.data.listing : l));
      handleCancelEdit();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("pricePerDay", form.pricePerDay);
    data.append("category", form.category);
    if (form.image) data.append("image", form.image);

    try {
      const res = await api.post("/listings", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(prev => [res.data, ...prev]);
      setCreating(false);
      setForm(emptyForm);
    } catch (err) {
      console.error("Creation failed", err);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await api.put(`/admin/bookings/${bookingId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookings(prev =>
        prev.map(booking =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (err) {
      console.error("Failed to update booking status", err);
    }
  };

  const inputClass = "w-full mb-2 p-2 border border-ink-200 dark:border-ink-700 rounded-md bg-white dark:bg-ink-800 focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm";

  return (
    <div className="p-4 sm:p-6 py-10 max-w-7xl mx-auto">
      <h1 className="font-display text-2xl sm:text-3xl text-center mb-10 text-ink-800 dark:text-ink-100">Admin Dashboard</h1>

      <section className="mb-14">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h2 className="font-display text-xl text-ink-800 dark:text-ink-100">Listings</h2>
          <button onClick={() => setCreating(true)} className="bg-amber-400 hover:bg-amber-300 text-ink-900 font-semibold text-sm px-4 py-1.5 rounded-full transition-colors duration-200">+ New Listing</button>
        </div>
        {creating && (
          <div className="border border-ink-200 dark:border-ink-700 p-4 rounded-md mb-6 bg-white dark:bg-ink-800">
            <input type="text" placeholder="Title" className={inputClass} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea placeholder="Description" className={inputClass} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input type="number" placeholder="Price/Day" className="w-full p-2 border border-ink-200 dark:border-ink-700 rounded-md bg-white dark:bg-ink-800 focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm" value={form.pricePerDay} onChange={e => setForm({ ...form, pricePerDay: e.target.value })} />
              <select className="w-full p-2 border border-ink-200 dark:border-ink-700 rounded-md bg-white dark:bg-ink-800 focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <input type="file" className="w-full mb-2 text-sm text-ink-500 dark:text-ink-400" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
            <div className="flex gap-2">
              <button onClick={handleCreate} className="bg-amber-400 hover:bg-amber-300 text-ink-900 font-semibold px-4 py-1.5 rounded-full text-sm transition-colors duration-200">Save</button>
              <button onClick={() => { setCreating(false); setForm(emptyForm); }} className="bg-ink-100 dark:bg-ink-700 hover:bg-ink-200 dark:hover:bg-ink-600 text-ink-700 dark:text-ink-200 px-4 py-1.5 rounded-full text-sm transition-colors duration-200">Cancel</button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map(listing => (
            <div key={listing._id} className="p-4 border border-ink-200 dark:border-ink-700 rounded-md bg-white dark:bg-ink-800">
              {editingId === listing._id ? (
                <>
                  <input type="text" value={form.title} className={inputClass} onChange={e => setForm({ ...form, title: e.target.value })} />
                  <textarea value={form.description} className={inputClass} onChange={e => setForm({ ...form, description: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input type="number" value={form.pricePerDay} className="w-full p-2 border border-ink-200 dark:border-ink-700 rounded-md bg-white dark:bg-ink-800 focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm" onChange={e => setForm({ ...form, pricePerDay: e.target.value })} />
                    <select className="w-full p-2 border border-ink-200 dark:border-ink-700 rounded-md bg-white dark:bg-ink-800 focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <input type="file" className="w-full mb-2 text-sm text-ink-500 dark:text-ink-400" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(listing._id)} className="bg-amber-400 hover:bg-amber-300 text-ink-900 font-semibold px-4 py-1.5 rounded-full text-sm transition-colors duration-200">Save</button>
                    <button onClick={handleCancelEdit} className="bg-ink-100 dark:bg-ink-700 hover:bg-ink-200 dark:hover:bg-ink-600 text-ink-700 dark:text-ink-200 px-4 py-1.5 rounded-full text-sm transition-colors duration-200">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-40 w-full bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-md overflow-hidden mb-3">
                    {resolveImageSrc(listing.image) && (
                      <img src={resolveImageSrc(listing.image)} alt={listing.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <h3 className="font-semibold text-ink-800 dark:text-ink-100">{listing.title}</h3>
                  <p className="text-ink-500 dark:text-ink-400 text-sm mt-1 line-clamp-2">{listing.description}</p>
                  <p className="text-ink-800 dark:text-ink-100 font-semibold mt-1">{listing.pricePerDay.toLocaleString()} Ks / day</p>
                  <p className="text-xs text-ink-400 dark:text-ink-500 mt-1">Category: {listing.category} · Created {new Date(listing.createdAt).toLocaleDateString()}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleEdit(listing)} className="px-3 py-1 bg-ink-100 dark:bg-ink-700 hover:bg-ink-200 dark:hover:bg-ink-600 text-ink-700 dark:text-ink-200 rounded-full text-sm transition-colors duration-200">Edit</button>
                    <button onClick={() => handleDeleteListing(listing._id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-colors duration-200">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="font-display text-xl mb-4 text-ink-800 dark:text-ink-100">Users</h2>
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user._id} className="p-4 border border-ink-200 dark:border-ink-700 rounded-md bg-white dark:bg-ink-800 flex justify-between items-center flex-wrap gap-2">
              <div>
                <p className="font-medium text-ink-800 dark:text-ink-100">{user.name} <span className="text-ink-400 dark:text-ink-500 font-normal">({user.email})</span></p>
                <p className="text-sm text-ink-500 dark:text-ink-400">{user.isAdmin ? 'Admin' : 'User'}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowUserModal(true);
                  }}
                  className="px-3 py-1 bg-ink-100 dark:bg-ink-700 hover:bg-ink-200 dark:hover:bg-ink-600 text-ink-700 dark:text-ink-200 rounded-full text-sm transition-colors duration-200"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {showUserModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-ink-900/60 z-50 px-4">
          <div className="bg-white dark:bg-ink-800 rounded-lg p-6 w-full max-w-md shadow-xl text-center">
            <h2 className="font-display text-xl mb-4 text-ink-800 dark:text-ink-100">User Details</h2>
            {resolveImageSrc(selectedUser.profileImage) ? (
              <img
                src={resolveImageSrc(selectedUser.profileImage)}
                alt="Profile"
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xl font-display text-amber-700 dark:text-amber-300">
                {selectedUser.name?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="text-sm text-ink-700 dark:text-ink-200 space-y-1 text-left max-w-xs mx-auto">
              <p><strong className="text-ink-800 dark:text-ink-100">Name:</strong> {selectedUser.name}</p>
              <p><strong className="text-ink-800 dark:text-ink-100">Email:</strong> {selectedUser.email}</p>
              <p><strong className="text-ink-800 dark:text-ink-100">Phone:</strong> {selectedUser.phone || "N/A"}</p>
              <p><strong className="text-ink-800 dark:text-ink-100">Address:</strong> {selectedUser.address || "N/A"}</p>
              <p><strong className="text-ink-800 dark:text-ink-100">Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
              <p><strong className="text-ink-800 dark:text-ink-100">Role:</strong> {selectedUser.isAdmin ? "Admin" : "User"}</p>
            </div>
            <div className="mt-5 text-right">
              <button
                onClick={() => setShowUserModal(false)}
                className="bg-ink-100 dark:bg-ink-700 hover:bg-ink-200 dark:hover:bg-ink-600 text-ink-700 dark:text-ink-200 px-4 py-2 rounded-full text-sm transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <section>
        <h2 className="font-display text-xl mb-4 text-ink-800 dark:text-ink-100">Bookings</h2>
        <ul className="space-y-4">
          {bookings.map(booking => (
            <li key={booking._id} className="border border-ink-200 dark:border-ink-700 p-4 rounded-md bg-white dark:bg-ink-800">
              <p className="text-sm text-ink-700 dark:text-ink-200"><strong className="text-ink-800 dark:text-ink-100">User:</strong> {booking.user?.name} ({booking.user?.email})</p>
              <p className="text-sm text-ink-700 dark:text-ink-200"><strong className="text-ink-800 dark:text-ink-100">Listing:</strong> {booking.listing?.title}</p>
              <p className="text-sm text-ink-700 dark:text-ink-200"><strong className="text-ink-800 dark:text-ink-100">Start:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
              <p className="text-sm text-ink-700 dark:text-ink-200"><strong className="text-ink-800 dark:text-ink-100">End:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
              <p className="text-sm text-ink-700 dark:text-ink-200"><strong className="text-ink-800 dark:text-ink-100">Payment:</strong> Cash on Delivery</p>
              <p className="text-xs text-ink-400 dark:text-ink-500 mt-1">Booked at: {new Date(booking.createdAt).toLocaleString()}</p>
              <p className={`mt-1 text-sm font-semibold ${booking.status === 'Confirmed' ? 'text-green-600' : 'text-amber-600 dark:text-amber-400'}`}>
                Status: {booking.status}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Change Status:</label>
                <select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                  className="border border-ink-200 dark:border-ink-700 rounded-md bg-white dark:bg-ink-800 px-2 py-1 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminDashboard;
