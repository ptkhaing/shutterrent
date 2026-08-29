const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalListings = await Listing.countDocuments({ user: user._id });
    const totalBookings = await Booking.countDocuments({ user: user._id });

    res.json({ ...user._doc, totalListings, totalBookings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password", err);
    res.status(500).json({ message: "Failed to change password" });
  }
};

module.exports = {
  getUserProfile,
  changePassword
};