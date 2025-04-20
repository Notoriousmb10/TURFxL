import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button } from "@mui/material";
import { format } from "date-fns"; // Import date-fns for formatting

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};

  if (!bookingDetails) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h5" color="error">
          No booking details found!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Box>
    );
  }

  const { name, city, date, slot, turf, price } = bookingDetails;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        p: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 2,
          maxWidth: 600,
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" color="success.main" gutterBottom>
          Booking Successful!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Thank you for booking with us. Here are your booking details:
        </Typography>
        <Box sx={{ mt: 3, textAlign: "left" }}>
          <Typography variant="h6">Booking Details:</Typography>
          <Typography variant="body1">
            <strong>Turf Name:</strong> {name}
          </Typography>
          <Typography variant="body1">
            <strong>City:</strong> {city}
          </Typography>
          <Typography variant="body1">
            <strong>Date:</strong> {format(new Date(date), "yyyy-MM-dd")} {/* Format date */}
          </Typography>
          <Typography variant="body1">
            <strong>Time Slot:</strong> {slot}
          </Typography>
          <Typography variant="body1">
            <strong>Turf:</strong> {turf}
          </Typography>
          <Typography variant="body1">
            <strong>Price Paid:</strong> ₹{price}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default BookingSuccess;
