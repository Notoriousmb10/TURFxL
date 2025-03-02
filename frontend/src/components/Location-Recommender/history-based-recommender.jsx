import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import './history-based-recommender.css'; // Import CSS for styling

const HistoryBasedRecommender = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user.id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurfs = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await axios.get(
          `http://localhost:5000/recommend_turfs_based_on_booking_history`,
          {
            params: {
              user_id: userId,
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
  }, [userId]);

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
    console.log(tour)
    navigate("/turfs/bookturf", { state: { tour } });
  };

  return (
    <Box className="recommender-container">
      <Typography variant="h4" gutterBottom>
        Recommended Turfs Based on Your Booking History
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Our AI model has analyzed your past bookings to suggest these turfs for you.
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : turfs.length === 0 ? (
        <Alert severity="info">No turfs found.</Alert>
      ) : (
        <Box className="turf-grid">
          {turfs.map((turf, index) => (
            <Box
              key={index}
              onClick={() => handleNavigation(turf)}
              className="turf-card"
              style={{ backgroundImage: `url(${turf.images?.[0] || ''})` }}
            >
              <Box className="turf-info">
                <Typography variant="h6">{turf.name}</Typography>
                <Typography variant="body2">₹{turf.price_per_hour}/hr</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HistoryBasedRecommender;