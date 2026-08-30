import React, { useEffect, useState } from 'react';
import api from '../api';
import { resolveImageSrc } from '../utils/image';

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', profileImage: null });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const userRes = await api.get('/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);
        setForm({
          name: userRes.data.name || '',
          phone: userRes.data.phone || '',
          address: userRes.data.address || '',
          profileImage: null
        });
      } catch (err) {
        console.error('Error loading profile data', err);
      }
    };

    fetchData();
  }, []);

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = async () => {
    const token = localStorage.getItem('token');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setSuccessMessage("❌ New passwords do not match!");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    try {
      await api.put('/auth/change-password', passwords, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowPasswordForm(false);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSuccessMessage("✅ Password updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Password update failed", err);
      setSuccessMessage("❌ Failed to update password");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append("name", form.name);
    data.append("phone", form.phone);
    data.append("address", form.address);
    if (form.profileImage) data.append("profileImage", form.profileImage);

    try {
      const res = await api.put('/user/update', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!user) return <p className="text-center mt-12 text-ink-500 dark:text-ink-400">Loading profile...</p>;

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white dark:bg-ink-800 p-8 rounded-xl shadow-sm border border-ink-100 dark:border-ink-700 flex flex-col sm:flex-row items-center sm:items-start gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          {resolveImageSrc(user.profileImage) ? (
            <img
              src={resolveImageSrc(user.profileImage)}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover shadow-sm"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-2xl font-display text-amber-700 dark:text-amber-300 shadow-sm">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-3">
          <h2 className="font-display text-2xl text-ink-800 dark:text-ink-100 mb-2">Your Profile</h2>

          {editing ? (
            <div className="space-y-3">
              <input type="text" placeholder="Name" className="w-full p-2 border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 rounded-md focus:ring-2 focus:ring-amber-400 focus:outline-none" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input type="text" placeholder="Phone" className="w-full p-2 border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 rounded-md focus:ring-2 focus:ring-amber-400 focus:outline-none" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input type="text" placeholder="Address" className="w-full p-2 border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 rounded-md focus:ring-2 focus:ring-amber-400 focus:outline-none" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              <input type="file" onChange={e => setForm({ ...form, profileImage: e.target.files[0] })} className="w-full text-sm text-ink-500 dark:text-ink-400" />
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="bg-amber-400 hover:bg-amber-300 text-ink-900 font-semibold px-4 py-2 rounded-full transition-colors duration-200">Save</button>
                <button onClick={() => setEditing(false)} className="bg-ink-100 dark:bg-ink-700 hover:bg-ink-200 dark:hover:bg-ink-600 text-ink-700 dark:text-ink-200 px-4 py-2 rounded-full transition-colors duration-200">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-ink-700 dark:text-ink-200">
              <p><span className="font-semibold text-ink-800 dark:text-ink-100">Name:</span> {user.name}</p>
              <p><span className="font-semibold text-ink-800 dark:text-ink-100">Email:</span> {user.email}</p>
              <p><span className="font-semibold text-ink-800 dark:text-ink-100">Phone:</span> {user.phone || "Not set"}</p>
              <p><span className="font-semibold text-ink-800 dark:text-ink-100">Address:</span> {user.address || "Not set"}</p>
              <p><span className="font-semibold text-ink-800 dark:text-ink-100">Role:</span> {user.isAdmin ? "Admin" : "User"}</p>
              <p><span className="font-semibold text-ink-800 dark:text-ink-100">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setEditing(true)} className="bg-amber-400 hover:bg-amber-300 text-ink-900 font-semibold px-4 py-2 rounded-full transition-colors duration-200">Edit Profile</button>
                <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="bg-ink-100 dark:bg-ink-700 hover:bg-ink-200 dark:hover:bg-ink-600 text-ink-700 dark:text-ink-200 px-4 py-2 rounded-full transition-colors duration-200">Change Password</button>
              </div>

              {successMessage && (
                <p className={`mt-2 text-sm font-medium ${successMessage.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                  {successMessage}
                </p>
              )}

              {showPasswordForm && (
                <div className="mt-4 w-full space-y-2">
                  {["currentPassword", "newPassword", "confirmPassword"].map((field, i) => {
                    const label = ["Current Password", "New Password", "Confirm New Password"][i];
                    const key = ["current", "new", "confirm"][i];
                    return (
                      <div className="relative" key={key}>
                        <label className="block text-sm font-medium mb-1 text-ink-700 dark:text-ink-200">{label}</label>
                        <input
                          type={showPassword[key] ? "text" : "password"}
                          placeholder={label}
                          className="w-full px-4 py-2 border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 rounded-md focus:ring-2 focus:ring-amber-400 focus:outline-none pr-16"
                          value={passwords[field]}
                          onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => togglePassword(key)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600 dark:text-amber-400 text-sm hover:underline"
                        >
                          {showPassword[key] ? "Hide" : "Show"}
                        </button>
                      </div>
                    );
                  })}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handlePasswordChange}
                      className="bg-amber-400 hover:bg-amber-300 text-ink-900 font-semibold px-4 py-2 rounded-full transition-colors duration-200"
                    >
                      Save Password
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      }}
                      className="bg-ink-100 dark:bg-ink-700 hover:bg-ink-200 dark:hover:bg-ink-600 text-ink-700 dark:text-ink-200 px-4 py-2 rounded-full transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;