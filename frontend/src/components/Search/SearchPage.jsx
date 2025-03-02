import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SearchFunc from "../../pages/SearchFunc";
import TurfRecommendation from "../../functionalities/TurfRecommendation";
import LocationRecommender from "../Location-Recommender/location-recommender";
import HistoryBasedRecommender from "../Location-Recommender/history-based-recommender";

const SearchPage = () => {
  const [isNewUser, setIsNewUser] = useState(false);
  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    const checkNewUser = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/user_check`,
          { user_id: userId }
        );
        setIsNewUser(response.data.exists);
      } catch (error) {
        console.error("Error checking new user status:", error);
      }
    };

    checkNewUser();
  }, [userId]);

  return (
    <div>
      <SearchFunc />
      {isNewUser !== null && (
        <>
          {isNewUser ? (
            <LocationRecommender />
          ) : (
            <HistoryBasedRecommender />
          )}
        </>
      )}
      <TurfRecommendation />
    </div>
  );
};

export default SearchPage;
