// src/components/SearchResults.jsx
import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  GeoPoint,
} from "firebase/firestore";
import "./SearchResults.css";
import { useLocation } from "react-router-dom";
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

  return (
    <div className="turfdisplayholder">
      {turfs.length > 0 ? (
        <ul>
          {turfs.map((turf, index) => (
            <li key={index}>
              <div className="turfcontainer">
                <div>
                  <img src={turf.photo} alt="turfimg" />
                  <button className=" turfbookbtn">Book Now</button>
                </div>
                <div className="pholder">
                  <h3>{turf.name}</h3>
                  <p className="desc">Description: {turf.description}</p>
                  <p className="ratings">Ratings: {turf.ratings}</p>
                  <p className="pricing">Pricing: {turf.pricing}</p>
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
