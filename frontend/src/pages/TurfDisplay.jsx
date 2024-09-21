import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TurfDisplay = () => {
  const location = useLocation();
  const { tour } = location.state || {};
  const { name, city, photo: image, price, description } = tour || {};
  const navigate = useNavigate();

  if (!tour) {
    return <div>No tour data available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row mt-5">
        <div className="md:w-1/2">
          <img src={image} alt={name} className="w-full h-auto" />
        </div>
        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
          <h2 className="text-3xl font-bold mb-2">{name}</h2>
          <h4 className="text-xl text-gray-600 mb-4">{city}</h4>
          <p className="text-gray-700 mb-4">{description}</p>
          <h3 className="text-2xl font-semibold mb-4">₹{price} <span className="text-lg font-normal">/per hour</span></h3>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            onClick={() => navigate('/bookturf')}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurfDisplay;