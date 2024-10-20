import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";

export default function Sidebar({ open, onClose, name, city, image, price, desc, address, maxGroupSize }) {
  const [numPlayers, setNumPlayers] = useState(maxGroupSize);

  // Ensure price and maxGroupSize are valid numbers
  const validPrice = parseFloat(price) || 0;
  const validMaxGroupSize = parseInt(maxGroupSize, 10) || 1;

  const [totalPrice, setTotalPrice] = useState(validPrice);

  useEffect(() => {
    setNumPlayers(validMaxGroupSize); // Set default value to maxGroupSize when Sidebar opens
    setTotalPrice(validPrice); // Set total price to the initial price
  }, [validMaxGroupSize, validPrice, open]);

  const handleNumPlayersChange = (event) => {
    const newNumPlayers = parseInt(event.target.value, 10) || 1;
    setNumPlayers(newNumPlayers);
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:3001/pay/bookTurf", {
        amount: totalPrice,
      });

      const { orderId, key_id } = response.data;

      const options = {
        key: key_id,
        amount: totalPrice * 100, // Convert to paise
        currency: "INR",
        name: name,
        description: desc,
        order_id: orderId,
        handler: function (response) {
          // Handle payment success
          console.log(response);
          // You can redirect to a success page or show a success message here
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error creating Razorpay order", error);
    }
  };

  const pricePerPlayer = totalPrice / numPlayers; // Calculate price per player

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
    >
      <Box>
        <Box p={2}>
          <Typography variant="h6">Turf Booking</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ my: 2 }}>
            Max Group Size: {maxGroupSize}
          </Typography>
          <TextField
            label="Number of Players"
            type="number"
            value={numPlayers}
            onChange={handleNumPlayersChange}
            inputProps={{ min: 1 }}
            fullWidth
          />
          <Typography variant="body1" sx={{ my: 2 }}>
            Price per Player: ₹{pricePerPlayer.toFixed(2)}
          </Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            Total Price: ₹{totalPrice.toFixed(2)}
          </Typography>
          <Button variant="contained" color="primary" fullWidth onClick={handlePayment}>
            Continue to Payment
          </Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
}