import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import SearchResultList from "../pages/SearchResultList";
import Tours from "../pages/Tours";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ThankYou from "../pages/ThankYou";
import CommunityPage from "../pages/CommunityPage";
import TurfDisplay from "../pages/TurfDisplay";
import SearchResult from "../pages/SearchResult";
import SearchPage from "../components/Search/SearchPage";
import LocationRecommender from "../components/Location-Recommender/location-recommender";
import HistoryBasedRecommender from "../components/Location-Recommender/history-based-recommender";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/turfs" element={<Tours />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path='/searchresults' element={<SearchResult />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/turfs/bookturf" element={<TurfDisplay />} />
      <Route path="/turfs/search" element={<SearchResultList />} />
      <Route path="/recommend/location-based" element={<LocationRecommender />} />
      <Route path="/recommend/booking-history-based" element={<HistoryBasedRecommender />} />
      <Route path="/login/sso-callback" element={<AuthenticateWithRedirectCallback />} />
    </Routes>
  );
};

export default Routers;
