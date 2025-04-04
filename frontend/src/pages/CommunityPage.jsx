import React, { useEffect, useState } from "react";
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
      setUsers([]);
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
          body: JSON.stringify({
            sendersUserId: user.id,
            receiversUserId: receiverId,
          }),
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
        if (data.friend_requests) {
          setFriendRequests(data.friend_requests);
        } else {
          setFriendRequests([]);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchFriendRequests();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Community Page</h1>
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            className="w-full max-w-md border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for friends by name or username..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {/* Search Results */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
          {users.length > 0 ? (
            <ul className="space-y-4">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between bg-white p-4 rounded shadow"
                >
                  <span>
                    {user.name} (@{user.username})
                  </span>
                  <button
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => handleFriendRequest(user.id)}
                  >
                    <span className="mr-2 text-lg">+</span> Add Friend
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No users found</p>
          )}
        </div>
        {/* Friend Requests */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Incoming Friend Requests
          </h2>
          {Object.entries(friendRequests || {}).length > 0 ? (
            Object.entries(friendRequests).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center bg-white p-4 rounded shadow mb-4"
              >
                <img
                  className="w-12 h-12 rounded-full mr-4"
                  src={`https://ui-avatars.com/api/?name=${value}&background=random`}
                  alt={`${value}'s avatar`}
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{value}</h3>
                  <p className="text-sm text-gray-500">@{key}</p>
                </div>
                <div className="space-x-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                    Accept
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No friend requests</p>
          )}
        </div>
        {/* Friends List */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Friends</h2>
          {users.length > 0 ? (
            <ul className="space-y-2">
              {users.map((friend) => (
                <li
                  key={friend.id}
                  className="flex items-center bg-white p-3 rounded shadow"
                >
                  <div className="mr-4 font-semibold">{friend.name}</div>
                  <div className="text-gray-500">@{friend.username}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">You have no friends yet</p>
          )}
        </div>
        {/* Chats */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Chats</h2>
          {chats.length > 0 ? (
            <ul className="space-y-4">
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  className="bg-white p-4 rounded shadow flex flex-col"
                >
                  <div className="font-semibold">{chat.name}</div>
                  <div className="text-gray-500">{chat.lastMessage}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No active chats</p>
          )}
        </div>
        {/* Community Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Community Features</h2>
          <p className="text-gray-500">More features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
