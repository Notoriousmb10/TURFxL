import React, { useState, useEffect } from "react";
import axios from "axios";

const TurfRecommendations = ({ userLocation, userId, maxPrice, filterType }) => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLocation) return;

    const fetchTurfs = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:5000/get_turfs", {
          params: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            user_id: userId,
            max_price: maxPrice,
            filter: filterType,
          },
        });
        setTurfs(response.data.turfs);
      } catch (error) {
        console.error("Error fetching turfs:", error);
      }
      setLoading(false);
    };

    fetchTurfs();
  }, [userLocation, userId, maxPrice, filterType]);

  return (
    <div>
      <h2>Recommended Turfs</h2>
      {loading ? <p>Loading turfs...</p> : turfs.length === 0 ? <p>No turfs found.</p> : (
        <ul>
          {turfs.map((turf, index) => (
            <li key={index}>
              <strong>{turf.name}</strong> - {turf.city} - ₹{turf.price_per_hour}/hr
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TurfRecommendations;
