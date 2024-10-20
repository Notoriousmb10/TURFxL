import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./SearchResults.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

const SearchResults = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchLocation = useLocation();

  useEffect(() => {
    const fetchTurfs = async () => {
      const searchParams = new URLSearchParams(searchLocation.search);
      const locationQuery = searchParams.get("location");

      if (locationQuery) {
        const q = query(
          collection(db, "turfs"),
          where("location", "==", locationQuery)
        );

        const querySnapshot = await getDocs(q);
        const turfsData = querySnapshot.docs.map((doc) => doc.data());
        setTurfs(turfsData);
      }
    };

    fetchTurfs();
  }, [searchLocation]);

  const handleBookNow = (turf) => {
    setSelectedTurf(turf);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedTurf(null);
  };

  return (
    <div className="turfdisplayholder">
      {turfs.length > 0 ? (
        <ul>
          {turfs.map((turf, index) => (
            <li key={index}>
              <div
                className="turfcontainer"
                style={{
                  backgroundImage: `url(${turf.photo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="overlay"></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <img src={turf.photo} alt="turfimg" />
                  <button className="turfbookbtn" onClick={() => handleBookNow(turf)}>Book Now</button>
                </div>
                <div className="pholder" style={{ position: 'relative', zIndex: 1 }}>
                  <h3 className="text-white ">{turf.name}</h3> 
                  <p className="desc">Description: {turf.description}</p>
                  <p className="ratings">Ratings: {turf.ratings}</p>
                  <p className="pricing">Pricing: {turf.pricing} per/Hour</p>
                  <p className="location">Location: {turf.location}</p>
                  <p className="location">Max Group Size: {turf.maxGroupSize}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No turfs found</p>
      )}
      {selectedTurf && (
        <Sidebar
          open={isSidebarOpen}
          onClose={handleCloseSidebar}
          name={selectedTurf.name}
          city={selectedTurf.location}
          image={selectedTurf.photo}
          price={selectedTurf.pricing}
          desc={selectedTurf.description}
          address={selectedTurf.address || "No Address"}
          maxGroupSize={selectedTurf.maxGroupSize || 1}
        />
      )}
    </div>
  );
};

export default SearchResults;