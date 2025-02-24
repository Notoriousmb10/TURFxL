import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FormControl, InputLabel, Select, MenuItem, Box, Typography, Slider } from "@mui/material";
import "./TurfRecommendation.css"; // Import the CSS file for styling

const TurfRecommendations = ({
}) => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("location"); // Add filter state
  const [priceRange, setPriceRange] = useState([0, 5000]); // Add price range state
  const { latitude, longitude } = useSelector((state) => state.location);

  useEffect(() => {
    console.log('working')

    const fetchTurfs = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await axios.get(
          `/api/get_turfs?latitude=${latitude}&longitude=${longitude}&filter=${filter}&min_price=${priceRange[0]}&max_price=${priceRange[1]}`
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
  }, [latitude, longitude, filter, priceRange]); // Add priceRange to dependency array

  return (
    <div>
      <Box className="filter-options" mb={2} display="flex" alignItems="center" paddingX="64px">
        <FormControl variant="outlined" sx={{ minWidth: 200, marginRight: 2 }}>
          <InputLabel>Filter by</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter by"
          >
            <MenuItem value="location">Location</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
          </Select>
        </FormControl>
        {filter === "price" && (
          <Box sx={{ width: 200 }}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={5000}
              step={100}
            />
          </Box>
        )}
      </Box>
      {loading ? (
        <p>Loading turfs...</p>
      ) : error ? (
        <p>{error}</p>
      ) : turfs.length === 0 ? (
        <p>No turfs found.</p>
      ) : (
        <div className="turf-grid">
          {turfs.map((turf, index) => (
            <div key={index} className="turf-card" style={{ backgroundImage: `url(${turf.images[0]})` }}>
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
