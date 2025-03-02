import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./TurfRecommendation.css"; // Import the CSS file for styling

const TurfRecommendations = ({ priceRange }) => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { latitude, longitude } = useSelector((state) => state.location);

  const navigate = useNavigate();

  const handleNavigation = (turf) => {
    const tour = {
      title: turf.name,
      city: turf.city,
      photo: turf.images,
      price: turf.price_per_hour,
      desc: "New Turf",
      address: turf.city,
      maxGroupSize: 11,
    };
    navigate("/turfs/bookturf", { state: { tour } });
  };

  useEffect(() => {
    const fetchTurfs = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await axios.post(
          `http://localhost:3001/search/turfs`, // Ensure this matches the backend route
          {
            latitude,
            longitude,
            min_price: priceRange[0],
            max_price: priceRange[1],
          }
        );
        setTurfs(response.data.turfs);
      } catch (error) {
        console.error("Error fetching turfs:", error);
        if (error.response) {
          // Server responded with a status other than 200 range
          setError(`Server Error: ${error.response.status}`);
        } else if (error.request) {
          // Request was made but no response received
          setError("Network Error: No response received from server.");
        } else {
          // Something else happened while setting up the request
          setError(`Error: ${error.message}`);
        }
      }
      setLoading(false);
    };

    fetchTurfs();
  }, [latitude, longitude, priceRange]); // Add priceRange to dependency array

  return (
    <div>
      {loading ? (
        <p>Loading turfs...</p>
      ) : error ? (
        <p>{error}</p>
      ) : turfs.length === 0 ? (
        <p>No turfs found.</p>
      ) : (
        <div className="turf-grid">
          {turfs.map((turf, index) => (
            <div
              key={index}
              onClick={() => handleNavigation(turf)}
              className="turf-card"
              style={{ backgroundImage: `url(${turf.images[0]})` }}
            >
              <div className="turf-info">
                <strong>{turf.name}</strong>
                <p>₹{turf.price_per_hour}/hr</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TurfRecommendations;
