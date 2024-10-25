import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import { useUser } from "@clerk/clerk-react"; // Import Clerk's useUser hook

const timeSlots = [
  "7-8 AM", "8-9 AM", "9-10 AM", "10-11 AM", "11-12 PM",
  "12-1 PM", "1-2 PM", "2-3 PM", "3-4 PM", "4-5 PM",
  "5-6 PM", "6-7 PM", "7-8 PM", "8-9 PM", "9-10 PM",
  "10-11 PM", "11-12 PM"
];

export default function Sidebar({ open, onClose, name, city, image, price, desc, address, maxGroupSize }) {
  const [numPlayers, setNumPlayers] = useState(maxGroupSize);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const { user } = useUser(); // Use Clerk's useUser hook to get user details

  // Ensure price and maxGroupSize are valid numbers
  const validPrice = parseFloat(price) || 0;
  const validMaxGroupSize = parseInt(maxGroupSize, 10) || 1;

  const [totalPrice, setTotalPrice] = useState(validPrice);

  useEffect(() => {
    setNumPlayers(validMaxGroupSize); // Set default value to maxGroupSize when Sidebar opens
    setTotalPrice(validPrice); // Set total price to the initial price
  }, [validMaxGroupSize, validPrice, open]);

  useEffect(() => {
    // Update total price based on the number of selected time slots
    const newTotalPrice = validPrice * selectedTimeSlots.length;
    setTotalPrice(newTotalPrice);
  }, [selectedTimeSlots, validPrice]);

  const handleNumPlayersChange = (event) => {
    const newNumPlayers = parseInt(event.target.value, 10) || 1;
    setNumPlayers(newNumPlayers);
  };

  const handleTimeSlotChange = (event) => {
    setSelectedTimeSlots(event.target.value);
  };

  const handleClearTimeSlots = () => {
    setSelectedTimeSlots([]);
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:3001/pay/bookTurf", {
        amount: totalPrice,
        timeSlots: selectedTimeSlots,
      });

      const { orderId, key_id } = response.data;

      if (window.Razorpay) {
        const options = {
          key: key_id,
          amount: totalPrice * 100, // Convert to paise
          currency: "INR",
          name: name,
          description: desc,
          order_id: orderId,
          handler: async function (response) {
            // Handle payment success
            console.log(response);

            // Send booking confirmation email
            try {
              await axios.post("http://localhost:3001/sendConfirmationEmail", {
                email: user.primaryEmailAddress.emailAddress, // Use Clerk's user email
                bookingDetails: {
                  name,
                  city,
                  image,
                  price,
                  desc,
                  address,
                  maxGroupSize,
                  timeSlots: selectedTimeSlots,
                  paymentId: response.razorpay_payment_id,
                },
              });
              console.log("Confirmation email sent successfully");
              alert("Booked successfully", name);

            } catch (error) {
              console.error("Error sending confirmation email", error);
              alert("Booked successfully", name);

            }

            // You can redirect to a success page or show a success message here
          },
          prefill: {
            name: user.fullName,
            email: user.primaryEmailAddress.emailAddress,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error("Razorpay SDK not loaded");
      }
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
            inputProps={{ min: 1, max: maxGroupSize }}
            fullWidth
          />
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="time-slot-label">Time Slot</InputLabel>
            <Select
              labelId="time-slot-label"
              multiple
              value={selectedTimeSlots}
              onChange={handleTimeSlotChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {timeSlots.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" color="secondary" fullWidth onClick={handleClearTimeSlots}>
            Clear Time Slots
          </Button>
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