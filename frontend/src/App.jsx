import AdminProfile from "./pages/AdminProfile";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Listings from "./pages/Listings";
import CreateListing from "./pages/CreateListing";
import Booking from "./pages/Booking";
import OrderHistory from "./pages/OrderHistory";
import AboutUs from "./pages/AboutUs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <>
      <Navbar />
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/listings" element={<Listings />} />
  <Route
    path="/create-listing"
    element={
      <AdminRoute>
        <CreateListing />
      </AdminRoute>
    }
  />
  <Route path="/book/:id" element={<Booking />} />
  <Route path="/orders" element={<OrderHistory />} />
  <Route path="/about" element={<AboutUs />} />
  <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    }
  />
  <Route
    path="/admin-profile"
    element={
      <AdminRoute>
        <AdminProfile />
      </AdminRoute>
    }
  />
</Routes>
    </>
  );
}

export default App;