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
        const friendRequestIds = Object.keys(data.friend_requests || {});
        // Map friend request IDs to user details (mocked for now)
        const mappedRequests = friendRequestIds.map((id) => ({
          id,
          name: `User ${id}`, // Replace with actual user details from backend
          username: `username_${id}`, // Replace with actual user details
        }));
        setFriendRequests(mappedRequests);
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
                  className="send-request-btn"
                  onClick={() => handleFriendRequest(user.id)}
                >
                  Send Friend Request
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
        {friendRequests.length > 0 ? (
          <div className="friend-requests-grid">
            {friendRequests.map((request) => (
              <div key={request.id} className="friend-request-card">
                <div className="friend-request-avatar">
                  <img
                    src={`https://ui-avatars.com/api/?name=${request.name}&background=random`}
                    alt={`${request.name}'s avatar`}
                  />
                </div>
                <div className="friend-request-info">
                  <h3 className="friend-request-name">{request.name}</h3>
                  <p className="friend-request-username">@{request.username}</p>
                </div>
                <div className="friend-request-actions">
                  <button className="accept-btn modern-btn">Accept</button>
                  <button className="decline-btn modern-btn">Decline</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-requests">No friend requests</p>
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
