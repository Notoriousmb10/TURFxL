import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import turfbg from "../assets/images/turfbg.jpg";
import { format } from "date-fns"; // Import date-fns for formatting
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const TurfDisplay = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const location = useLocation();
  const { tour, teamMembers = [] } = location.state || {};

  if (!tour) {
    return <Container>No tour data available</Container>;
  }

  const { title: name, city, photo: image, price, desc, address, maxGroupSize } = tour;

  const handleBookNow = () => {
    if (selectedDate && selectedSlot && selectedTurf) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd"); // Format the date
      setIsSidebarOpen(true);
    } else {
      alert("Please select a date, time slot, and turf before booking.");
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Generate available slots with unique IDs for ToggleButton values
  const generateAvailableSlots = (basePrice) => {
    return [
      { id: 1, time: "18:00 - 19:00", price: basePrice },
      { id: 2, time: "19:00 - 20:00", price: basePrice + 200 },
      { id: 3, time: "20:00 - 21:00", price: basePrice + 400 },
      { id: 4, time: "22:00 - 23:00", price: basePrice + 600 },
    ];
  };

  const availableSlots = generateAvailableSlots(price);
  const availableTurfs = ["Turf 1", "Turf 2", "Turf 3"];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${turfbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.95)",
          }}
        >
          <Grid container spacing={4}>
            {/* Image Section */}
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={image}
                alt={name}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
            {/* Info Section */}
            <Grid item xs={12} md={7}>
              <Typography variant="h4" gutterBottom>
                {name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {city}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {desc}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Address:</strong> {address}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Max Group Size:</strong> {maxGroupSize}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Price: ₹{price}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Booking Options Section */}
          <Grid container spacing={4}>
            {/* Date Selection */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Select Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                  renderInput={(params) => <Box sx={{ mt: 1 }}>{params.input}</Box>}
                />
              </LocalizationProvider>
            </Grid>
            {/* Slot Selection */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Available Slots
              </Typography>
              <ToggleButtonGroup
                color="primary"
                value={selectedSlot}
                exclusive
                onChange={(e, newSlot) => {
                  if (newSlot !== null) {
                    setSelectedSlot(newSlot);
                  }
                }}
                orientation="vertical"
                sx={{ width: "100%", gap: 1 }}
              >
                {availableSlots.map((slot) => (
                  <ToggleButton key={slot.id} value={slot} sx={{ justifyContent: "space-between" }}>
                    <span>{slot.time}</span>
                    <span>₹{slot.price}</span>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
            {/* Turf Selection */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Available Turf
              </Typography>
              <ToggleButtonGroup
                color="primary"
                value={selectedTurf}
                exclusive
                onChange={(e, newTurf) => {
                  if (newTurf !== null) {
                    setSelectedTurf(newTurf);
                  }
                }}
                orientation="vertical"
                sx={{ width: "100%", gap: 1 }}
              >
                {availableTurfs.map((turf) => (
                  <ToggleButton key={turf} value={turf}>
                    {turf}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Team Members Section */}
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.8)",
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Team Members
            </Typography>
            <Grid container spacing={2}>
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        borderRadius: 2,
                        backgroundColor: "rgba(240,240,240,0.9)",
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        {member}
                      </Typography>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  No team members available.
                </Typography>
              )}
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleBookNow}
            sx={{ py: 1.5 }}
          >
            Book Now
          </Button>
        </Paper>
      </Container>

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
        selectedDate={format(selectedDate, "yyyy-MM-dd")} // Pass formatted date
        selectedSlot={selectedSlot}
        selectedTurf={selectedTurf}
      />
    </Box>
  );
};

export default TurfDisplay;
