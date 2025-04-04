import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";

const HistoryBasedRecommender = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user.id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurfs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:5000/recommend_turfs_based_on_booking_history",
          {
            params: { user_id: userId },
          }
        );
        setTurfs(response.data);
      } catch (err) {
        if (err.response) {
          setError(`Server Error: ${err.response.status}`);
        } else if (err.request) {
          setError("Network Error: No response received from server.");
        } else {
          setError(`Error: ${err.message}`);
        }
      }
      setLoading(false);
    };

    if (userId) {
      fetchTurfs();
    }
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
    navigate("/turfs/bookturf", { state: { tour } });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Turfs Recommended Based on Your Booking History
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Our AI model has analyzed your past bookings to suggest these turfs for you.
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : turfs.length === 0 ? (
        <Alert severity="info">No turfs found.</Alert>
      ) : (
        <Grid container spacing={3}>
          {turfs.map((turf, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea onClick={() => handleNavigation(turf)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={turf.images?.[0] || ""}
                    alt={turf.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{turf.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{turf.price_per_hour}/hr
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default HistoryBasedRecommender;
