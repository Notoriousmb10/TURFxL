import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./TurfDisplay.css";
import Sidebar from "./Sidebar";
import turfbg from "../assets/images/turfbg.jpg";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";

const TurfDisplay = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const location = useLocation();
  const { tour } = location.state || {};

  if (!tour) {
    return <div>No tour data available</div>;
  }

  const {
    title: name,
    city,
    photo: image,
    price,
    desc,
    address,
    maxGroupSize,
  } = tour;

  const handleBookNow = () => {
    if (selectedDate && selectedSlot && selectedTurf) {
      setIsSidebarOpen(true);
    } else {
      alert("Please select a date, time slot, and turf before booking.");
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Fetch available slots for the selected date
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleTurfSelect = (turf) => {
    setSelectedTurf(turf);
  };

  const availableSlots = [
    { time: "18:00 - 19:00", price: 1200 },
    { time: "19:00 - 20:00", price: 1400 },
    { time: "20:00 - 21:00", price: 1600 },
    { time: "22:00 - 23:00", price: 1600 },
  ];

  const availableTurfs = ["Turf 1", "Turf 2", "Turf 3"];

  return (
    <div
      className="turf-display-page"
      style={{
        backgroundImage: `url(${turfbg})`,
      }}
    >
      <div className="container mx-auto p-4 turf-container">
        <div className="image-section">
          <img src={image} alt={name} className="imageturf" />
        </div>
        <div className="info-section">
          <Typography variant="h4">{name}</Typography>
          <Typography variant="subtitle1" className="city">
            {city}
          </Typography>
          <Typography variant="body1" className="description">
            {desc}
          </Typography>
          <Typography variant="body1" className="address">
            {address}
          </Typography>
          <Typography variant="body1" className="group-size">
            Max Group Size: {maxGroupSize}
          </Typography>
          <Typography variant="body1" className="price">
            Price: ₹{price}
          </Typography>
        </div>
        <div className="calendar-section">
          <Typography variant="h6">Select Date</Typography>
          <Box className="calendar">
            {[...Array(31).keys()].map((day) => (
              <Button
                key={day + 1}
                className={`calendar-day ${
                  selectedDate.getDate() === day + 1 ? "selected" : ""
                }`}
                onClick={() =>
                  handleDateChange(new Date(selectedDate.setDate(day + 1)))
                }
              >
                {day + 1}
              </Button>
            ))}
          </Box>
        </div>
        <div className="slots-section">
          <Typography variant="h6">Available Slots</Typography>
          <Box className="slots">
            {availableSlots.map((slot, index) => (
              <Button
                key={index}
                className={`slot ${selectedSlot === slot ? "selected" : ""}`}
                onClick={() => handleSlotSelect(slot)}
              >
                <Typography>{slot.time}</Typography>
                <Typography
                  sx={{
                    marginLeft: 4,
                  }}
                >
                  ₹{slot.price}
                </Typography>
              </Button>
            ))}
          </Box>
        </div>
        <div className="turf-section">
          <Typography variant="h6">Available Turf</Typography>
          <Box className="turf-options">
            {availableTurfs.map((turf, index) => (
              <Button
                key={index}
                className={`turf-option ${
                  selectedTurf === turf ? "selected" : ""
                }`}
                onClick={() => handleTurfSelect(turf)}
              >
                {turf}
              </Button>
            ))}
          </Box>
        </div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleBookNow}
        >
          Book Now
        </Button>
      </div>
      <Sidebar
        open={isSidebarOpen}
        onClose={handleCloseSidebar}
        name={name}
        city={city}
        image={image}
        price={selectedSlot ? selectedSlot.price : price}
        desc={desc}
        address={address}
        maxGroupSize={maxGroupSize}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        selectedTurf={selectedTurf}
      />
    </div>
  );
};

export default TurfDisplay;
