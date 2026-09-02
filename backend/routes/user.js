const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const upload = require("../middleware/upload");
const User = require("../models/User");
const { getUserProfile } = require("../controllers/authController");

// Existing profile route
router.get("/profile", authMiddleware, getUserProfile);

// Public endpoint for the About page's founder section — intentionally no
// auth required (it's shown to visitors who aren't logged in), and returns
// only name + profileImage, nothing sensitive. Whatever photo the admin has
// set on their own profile automatically shows up here too.
router.get("/founder", async (req, res) => {
  try {
    const founder = await User.findOne({ isAdmin: true }).select("name profileImage");
    if (!founder) return res.status(404).json({ message: "Founder profile not set" });
    res.json({ name: founder.name, profileImage: founder.profileImage });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add this new PUT route to update profile
router.put("/update", authMiddleware, upload.single("profileImage"), async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    if (req.file) updates.profileImage = req.file.path;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;