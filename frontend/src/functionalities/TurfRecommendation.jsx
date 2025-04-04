import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const defaultImage = "https://via.placeholder.com/400x200?text=No+Image";

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
      setError(null);
      try {
        const response = await axios.post(`http://localhost:3001/search/turfs`, {
          latitude,
          longitude,
          min_price: priceRange[0],
          max_price: priceRange[1],
        });
        setTurfs(response.data.turfs);
      } catch (error) {
        console.error("Error fetching turfs:", error);
        if (error.response) {
          setError(`Server Error: ${error.response.status}`);
        } else if (error.request) {
          setError("Network Error: No response from server.");
        } else {
          setError(`Error: ${error.message}`);
        }
      }
      setLoading(false);
    };

    if (latitude && longitude) {
      fetchTurfs();
    }
  }, [latitude, longitude, priceRange]);

  return (
    <Box sx={{ mt: 2 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" variant="body1" align="center">
          {error}
        </Typography>
      ) : turfs.length === 0 ? (
        <Typography variant="body1" align="center">
          No turfs found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {turfs.map((turf, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea onClick={() => handleNavigation(turf)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={turf.images && turf.images[0] ? turf.images[0] : defaultImage}
                    alt={turf.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {turf.name}
                    </Typography>
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

export default TurfRecommendations;
