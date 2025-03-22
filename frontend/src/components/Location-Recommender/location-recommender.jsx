import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LocationRecommender = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { latitude, longitude } = useSelector((state) => state.location);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurfs = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await axios.get(
          `http://localhost:5000/recommend_turfs_location_based`,
          {
            params: {
              latitude,
              longitude,
            },
          }
        );
        console.log(response.data);
        setTurfs(response.data);
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
  }, [latitude, longitude]);

  const handleNavigation = (turf) => {
    const tour = {
      title: turf.name,
      city: turf.details.city,
      photo: turf.details.images,
      price: turf.details.price_per_hour,
      desc: "New Turf",
      address: turf.details.city,
      maxGroupSize: 11,
    };
    console.log(tour)
    navigate("/turfs/bookturf", { state: { tour } });
  };

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
              onClick={() => handleNavigation(turf)} // Add onClick handler
              className="turf-card"
              style={{ backgroundImage: `url(${turf.details.images?.[0] || ''})` }} // Add optional chaining and fallback
            >
              <div className="turf-info">
                <strong>{turf.name}</strong>
                <p>₹{turf.details.price_per_hour}/hr</p> {/* Ensure price_per_hour is displayed */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationRecommender;