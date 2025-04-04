import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Box,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Container,
} from "@mui/material";
import SearchFunc from "../../pages/SearchFunc";
import TurfRecommendations from "../../functionalities/TurfRecommendation";
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
        const response = await axios.get(`http://127.0.0.1:5000/user_check`, {
          user_id: userId,
        });
        setIsNewUser(response.data.exists);
      } catch (error) {
        console.error("Error checking new user status:", error);
      }
    };

    if (userId) {
      checkNewUser();
    }
  }, [userId]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Search Function Section */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <SearchFunc />
        </Paper>

        {/* Filter Options */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FormControl variant="outlined" sx={{ minWidth: 180 }}>
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
              <Box sx={{ width: 250 }}>
                <Typography variant="body2" gutterBottom>
                  Price Range
                </Typography>
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
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Recommendations based on your recent bookings.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Recommender Section */}
        <Paper elevation={3} sx={{ p: 2 }}>
          {isNewUser !== null &&
            (isNewUser ? <LocationRecommender /> : <HistoryBasedRecommender />)}
        </Paper>

        {/* Turf Recommendations */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <TurfRecommendations filter={filter} priceRange={priceRange} />
        </Paper>
      </Stack>
    </Container>
  );
};

export default SearchPage;
