import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Paper, Grid } from "@mui/material";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_user_bookings", {
          params: { user_id: user.id },
        });
        setBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>
      {bookings.length > 0 ? (
        <Grid container spacing={3}>
          {bookings.map((booking, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6">{booking.turf_name}</Typography>
                <Typography variant="body1">
                  <strong>Date:</strong> {booking.date}
                </Typography>
                <Typography variant="body1">
                  <strong>Slot:</strong> {booking.slot}
                </Typography>
                <Typography variant="body1">
                  <strong>Price:</strong> ₹{booking.price}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No bookings found.
        </Typography>
      )}
    </Container>
  );
};

export default Bookings;
