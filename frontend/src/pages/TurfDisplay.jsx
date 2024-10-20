import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./TurfDisplay.css";
import Sidebar from "./Sidebar";
import turfbg from "../assets/images/turfbg.jpg";

const TurfDisplay = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { tour } = location.state || {};

  if (!tour) {
    return <div>No tour data available</div>;
  }

  const {
    title: name,
    city,
    photo: image,
    price,
    desc,
    address,
    maxGroupSize
  } = tour;

  const handleBookNow = () => {
    setIsSidebarOpen(true);
};

const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
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
                <h2 className="text -2xl">{name}</h2>
                <p className="text-lg">{city}</p>
                <p className="text-lg">{desc}</p>
                <p className="text-lg">{address}</p>
                <p className="text-lg">Max Group Size : {maxGroupSize}</p>
                <p className="text-lg">Price: ₹{price} </p>
                <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleBookNow}
                >
                    Book Now
                </button>
            </div>
        </div>
        <Sidebar
            open={isSidebarOpen}
            onClose={handleCloseSidebar}
            name={name}
            city={city}
            image={image}
            price={price}
            desc={desc}
            address={address}
            maxGroupSize={maxGroupSize}
        />
    </div>
);
}

export default TurfDisplay;