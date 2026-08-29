import React, { useEffect, useState } from "react";
import api from "../api";
import { resolveImageSrc } from "../utils/image";

function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingImage, setEditingImage] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
      } catch (err) {
        console.error("Error fetching admin profile", err);
      }
    };

    fetchAdmin();
  }, []);

  const handleImageSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profileImage", profileImage);

    try {
      const res = await api.put("/user/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(res.data);
      setEditingImage(false);
      setPreviewImage(null);
    } catch (err) {
      console.error("Failed to update profile image", err);
    }
  };

  const handlePasswordChange = async () => {
    const token = localStorage.getItem("token");

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await api.put("/auth/change-password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      console.error("Failed to change password", err);
      alert("Password update failed");
    }
  };

  if (!admin) return <p className="text-center mt-12 text-ink-500">Loading...</p>;

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-sm border border-ink-100 text-center">
        <h2 className="font-display text-2xl mb-4 text-ink-800">Admin Profile</h2>

        {resolveImageSrc(admin.profileImage) ? (
          <img
            src={resolveImageSrc(admin.profileImage)}
            alt="Profile"
            className="w-28 h-28 mx-auto rounded-full object-cover shadow-sm"
          />
        ) : (
          <div className="w-28 h-28 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-2xl font-display text-amber-700 shadow-sm">
            {admin.name?.slice(0, 2).toUpperCase()}
          </div>
        )}

        <p className="mt-4 text-lg font-semibold text-ink-800">{admin.name}</p>
        <p className="text-ink-500">{admin.email}</p>

        {editingImage && (
          <div className="mt-4 space-y-2">
            <input
              type="file"
              onChange={(e) => {
                setProfileImage(e.target.files[0]);
                setPreviewImage(URL.createObjectURL(e.target.files[0]));
              }}
              className="w-full text-sm text-ink-500"
            />
            {previewImage && (
              <img
                src={previewImage}
                className="w-24 h-24 mx-auto rounded-full object-cover"
              />
            )}
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={handleImageSave}
                className="bg-amber-400 hover:bg-amber-300 text-ink-900 font-semibold px-4 py-2 rounded-full transition-colors duration-200"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingImage(false);
                  setPreviewImage(null);
                }}
                className="bg-ink-100 hover:bg-ink-200 text-ink-700 px-4 py-2 rounded-full transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setEditingImage(true)}
            className="bg-amber-400 hover:bg-amber-300 text-ink-900 font-semibold px-4 py-2 rounded-full transition-colors duration-200"
          >
            Edit Profile Photo
          </button>
          <button
            onClick={() => setShowPasswordForm(true)}
            className="bg-ink-100 hover:bg-ink-200 text-ink-700 px-4 py-2 rounded-full transition-colors duration-200"
          >
            Change Password
          </button>
        </div>

        {showPasswordForm && (
          <div className="mt-4 w-full space-y-2 text-left">
            {["current", "new", "confirm"].map((field, idx) => (
              <div key={idx} className="relative">
                <input
                  type={showPassword[field] ? "text" : "password"}
                  placeholder={
                    field === "current"
                      ? "Current Password"
                      : field === "new"
                      ? "New Password"
                      : "Confirm New Password"
                  }
                  className="w-full p-2 border border-ink-200 rounded-md pr-10 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  value={passwords[field + "Password"] ?? passwords[field]}
                  onChange={(e) =>
                    setPasswords({ ...passwords, [field + "Password"]: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({ ...showPassword, [field]: !showPassword[field] })
                  }
                  className="absolute right-2 top-2 text-sm text-amber-600"
                >
                  {showPassword[field] ? "Hide" : "Show"}
                </button>
              </div>
            ))}
            <div className="flex justify-center gap-4 pt-2">
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
                className="bg-ink-100 hover:bg-ink-200 text-ink-700 px-4 py-2 rounded-full transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProfile;