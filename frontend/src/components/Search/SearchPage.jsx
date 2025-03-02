import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Slider,
} from "@mui/material";
import SearchFunc from "../../pages/SearchFunc";
import TurfRecommendation from "../../functionalities/TurfRecommendation";
import LocationRecommender from "../Location-Recommender/location-recommender";
import HistoryBasedRecommender from "../Location-Recommender/history-based-recommender";

const SearchPage = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [filter, setFilter] = useState("location");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    const checkNewUser = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/user_check`, {
          user_id: userId,
        });
        setIsNewUser(response.data.exists);
      } catch (error) {
        console.error("Error checking new user status:", error);
      }
    };

    checkNewUser();
  }, [userId]);

  return (
    <div>
      <SearchFunc />
      <Box
        className="filter-options"
        mb={2}
        display="flex"
        alignItems="center"
        paddingX="64px"
      >
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
        <Typography variant="body2" color="textSecondary">
          The results you see below are recommended after learning from your
          recent bookings.
        </Typography>
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
      {isNewUser !== null && (
        <>{isNewUser ? <LocationRecommender /> : <HistoryBasedRecommender />}</>
      )}
      <TurfRecommendation filter={filter} priceRange={priceRange} />
    </div>
  );
};

export default SearchPage;
