import React, { useEffect, useState } from "react";
import "./CommunityPage.css";
import { useUser } from "@clerk/clerk-react";

const CommunityPage = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [chats] = useState([
    { id: 1, name: "Alice Johnson", lastMessage: "Hey, how are you" },
    { id: 2, name: "Bob Brown", lastMessage: "Let’s catch up soon!" },
  ]);

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() === "") {
      setUsers([]); // Clear users if search is empty
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/search_users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchValue }),
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleFriendRequest = async (receiverId) => {
    try {
      const response = await fetch(
        "http://localhost:3001/send_friend_request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sendersUserId: user.id, receiversUserId: receiverId }),
        }
      );
      const data = await response.json();
      console.log("Friend request sent:", data);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/get_friend_requests?userId=${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log("API Response:", data); // Log the entire response
        console.log("Friend requests data:", data.friend_requests); // Log the specific field

        if (data.friend_requests) {
          setFriendRequests(data.friend_requests);
        } else {
          setFriendRequests([]); // Ensure it's an empty array if no data
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchFriendRequests();
  }, [user]);

  const filteredUsers = (users || []).filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.username &&
        user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="community-page">
      <h1 className="title">Community Page</h1>
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for friends by name or username..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="search-results-section">
        <h2>Search Results</h2>
        {users.length > 0 ? (
          <ul className="search-results-list">
            {users.map((user) => (
              <li key={user.id} className="search-result-item">
                {user.name} (@{user.username})
                <button
                  className="add-friend-btn"
                  onClick={() => handleFriendRequest(user.id)}
                >
                  <span className="add-friend-icon">+</span> Add Friend
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-results">No users found</p>
        )}
      </div>
      <div className="friend-requests-section">
        <h2 className="section-title">Incoming Friend Requests</h2>
        {Object.entries(friendRequests || {}).length > 0 ? (
          Object.entries(friendRequests).map(([key, value]) => (
            <div key={key} className="friend-request-card">
              <div className="friend-request-avatar">
                <img
                  src={`https://ui-avatars.com/api/?name=${value}&background=random`}
                  alt={`${value}'s avatar`}
                />
              </div>
              <div className="friend-request-info">
                <h3 className="friend-request-name">{value}</h3>
                <p className="friend-request-username">@{key}</p>
              </div>
              <div className="friend-request-actions">
                <button className="accept-btn modern-btn">Accept</button>
                <button className="decline-btn modern-btn">Decline</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-requests">No friend requests</p>
        )}
      </div>
      <div className="friends-section">
        <h2>Your Friends</h2>
        {users.length > 0 ? (
          <ul className="friends-list">
            {users.map((friend) => (
              <li key={friend.id} className="friend-item">
                <div className="friend-name">{friend.name}</div>
                <div className="friend-username">@{friend.username}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-friends">You have no friends yet</p>
        )}
      </div>
      <div className="chat-section">
        <h2>Chats</h2>
        {chats.length > 0 ? (
          <ul className="chat-list">
            {chats.map((chat) => (
              <li key={chat.id} className="chat-item">
                <div className="chat-name">{chat.name}</div>
                <div className="chat-message">{chat.lastMessage}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-chats">No active chats</p>
        )}
      </div>
      <div className="features-section">
        <h2>Community Features</h2>
        <p>More features coming soon...</p>
      </div>
    </div>
  );
};

export default CommunityPage;
