import "./App.css";
import Layout from "./components/Layout/Layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocation } from "./redux/actions/locationAction";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

function App() {
  const { isLoaded, user } = useUser(); // Destructure isLoaded and user from useUser
  const dispatch = useDispatch();
  const { latitude, longitude } = useSelector((state) => state.location);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

  useEffect(() => {
    const requestLocationPermission = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            dispatch(fetchLocation({ latitude, longitude }));
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setLocationPermissionDenied(true);
            }
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    requestLocationPermission();
  }, [dispatch]);

  useEffect(() => {
    const createUser = async () => {
      if (!isLoaded || !user) {
        console.log("User data is not loaded yet.");
        return;
      }

      const userData = {
        user_id: user.id,
        name: user.fullName,
        location: { lat: latitude, lng: longitude },
        prefered_price_range: [0, 1000],
        booking_history: [],
        favourites: [],
      };
      console.log("Creating user with data:", userData);

      try {
        const req = await axios.post(`http://localhost:3001/createUser`, {
          userData,
        });
        console.log("User created:", req.data.user);
      } catch (err) {
        console.error("Error creating user:", err);
      }
    };

    if (isLoaded && user) {
      createUser();
    }
  }, [isLoaded, user, latitude, longitude]);

  const sendFriendRequest = async (sendersUserId, receiversUserId) => {
    console.log("📩 Sending friend request:", { sendersUserId, receiversUserId }); // Debugging log

    try {
      const response = await axios.post("http://localhost:3001/send_friend_request", {
        sendersUserId,
        receiversUserId,
      });
      console.log("✅ Friend request sent:", response.data); // Debugging log
    } catch (error) {
      console.error("❌ Error sending friend request:", error.response?.data || error.message); // Debugging log
    }
  };

  if (locationPermissionDenied) {
    return (
      <div>
        <p>Location permission is required to use this app. Please enable location services in your browser settings.</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
        <Layout />
      </div>
      <button onClick={() => sendFriendRequest(user.id, "receiver_user_id")}>
        Send Friend Request
      </button>
    </div>
  );
}

export default App;