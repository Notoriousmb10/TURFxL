import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import SearchResultList from "../pages/SearchResultList";
import Tours from "../pages/Tours";
import Login from "../pages/Login";
import TourDetails from "../pages/TourDetails";
import Register from "../pages/Register";
import ThankYou from "../pages/ThankYou";
import TurfDisplay from "../pages/TurfDisplay";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/turfs" element={<Tours />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/turfs/:id" element={<TurfDisplay />} />
      <Route path="/turfs/search" element={<SearchResultList />} />
    </Routes>
  );
};

export default Routers;
