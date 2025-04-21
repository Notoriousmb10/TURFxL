import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state?.bookingDetails;

  if (!bookingDetails) {
    return <Container>No booking details available.</Container>;
  }

  const { name, city, date, slot, turf, price } = bookingDetails;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Booking Successful!
      </Typography>
      <Box sx={{ my: 2 }}>
        <Typography variant="body1"><strong>Turf:</strong> {name}</Typography>
        <Typography variant="body1"><strong>City:</strong> {city}</Typography>
        <Typography variant="body1"><strong>Date:</strong> {date}</Typography>
        <Typography variant="body1"><strong>Slot:</strong> {slot}</Typography>
        <Typography variant="body1"><strong>Turf Name:</strong> {turf}</Typography>
        <Typography variant="body1"><strong>Price:</strong> ₹{price}</Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
      >
        Go to Home
      </Button>
    </Container>
  );
};

export default BookingSuccess;
