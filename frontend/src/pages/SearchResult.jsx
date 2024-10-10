import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./SearchResults.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [turfs, setTurfs] = useState([]);
  const searchLocation = useLocation();

  useEffect(() => {
    const fetchTurfs = async () => {
      const searchParams = new URLSearchParams(searchLocation.search);
      const locationQuery = searchParams.get("location");

      if (locationQuery) {
        const q = query(
          collection(db, "turfs"),
          where("location", "==", locationQuery)
        );

        const querySnapshot = await getDocs(q);
        const turfsData = querySnapshot.docs.map((doc) => doc.data());
        setTurfs(turfsData);
      }
    };

    fetchTurfs();
  }, [searchLocation]);

  const handlePayment = async (turf) => {
    if (turf.pricing <= 0) {
      console.error("Invalid price provided");
      return;
    }

    try {
      // Make API call to create an order on the backend
      const orderResponse = await axios.post(
        "http://localhost:3001/pay/bookTurf",
        {
          amount: turf.pricing,
        }
      );

      const { orderId, key_id } = orderResponse.data;

      const options = {
        key: key_id, // Razorpay key_id from backend
        amount: turf.pricing * 100, // Convert price to paise
        currency: "INR",
        name: turf.name,
        description: turf.description || "Purchase Description",
        order_id: orderId, // Use the order ID from the backend
        handler: async function (response) {
          // Handle payment success
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          // Verify payment on backend
          const verificationResponse = await axios.post(
            "http://localhost:3001/pay/verifyPayment",
            {
              order_id: razorpay_order_id,
              payment_id: razorpay_payment_id,
              signature: razorpay_signature,
            }
          );

          if (verificationResponse.data.success) {
            console.log("Payment verified successfully");
          } else {
            console.error("Payment verification failed");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#000",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error creating Razorpay order", error);
    }
  };

  return (
    <div className="turfdisplayholder">
      {turfs.length > 0 ? (
        <ul>
          {turfs.map((turf, index) => (
            <li key={index}>
              <div
                className="turfcontainer"
                style={{
                  backgroundImage: `url(${turf.photo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="overlay"></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <img src={turf.photo} alt="turfimg" />
                  <button className="turfbookbtn" onClick={() => handlePayment(turf)}>Book Now</button>
                </div>
                <div className="pholder" style={{ position: 'relative', zIndex: 1 }}>
                  <h3 className="text-white ">{turf.name}</h3> 
                  <p className="desc">Description: {turf.description}</p>
                  <p className="ratings">Ratings: {turf.ratings}</p>
                  <p className="pricing">Pricing: {turf.pricing} per/Person</p>
                  <p className="location">Location: {turf.location}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No turfs found</p>
      )}
    </div>
  );
};

export default SearchResults;