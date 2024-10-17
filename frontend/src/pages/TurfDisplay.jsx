import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TurfDisplay.css";
import Sidebar from "./Sidebar";
import turfbg from "../assets/images/turfbg.jpg";

const TurfDisplay = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const { tour } = location.state || {};
  const navigate = useNavigate();

  if (!tour) {
    return <div>No tour data available</div>;
  }

  const {
    title: name,
    city,
    photo: image,
    price,
    reviews,
    maxGroupSize,
    distance,
    desc,
  } = tour;

  const handleBookNow = () => {
    setIsSidebarOpen(true);
    <Sidebar/>

  };

  return (
    <div
      className="md:w-max-md h-600"
      style={{
        backgroundImage: `url(${turfbg})`,
      }}
    >
      <div className="container mx-auto p-4 turf-container">
        <div className="md:w-1/2 ">
          <img src={image} alt={name} className="w-full h-auto imageturf" />
        </div>
        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
          <h2 className="text-3xl text-white font-bold mb-2">{name}</h2>
          <h4 className="text-xl text-white mb-4">{city}</h4>
          <p className="text-white mb-4">{desc}</p>
          <h3 className="text-2xl font-semibold text-white mb-4">
            ₹{price}{" "}
            <span className="text-lg text-white font-normal">/per hour</span>
          </h3>
          <button className="book-btn" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurfDisplay;
