import React, { useState } from 'react';
import './CommunityPage.css'; // Importing CSS for styling

const CommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', username: 'johndoe' },
    { id: 2, name: 'Jane Smith', username: 'janesmith' },
    { id: 3, name: 'Alice Johnson', username: 'alicej' },
  ]);
  const [friendRequests] = useState([
    { id: 1, name: 'John Doe', username: 'johndoe' },
    { id: 2, name: 'Jane Smith', username: 'janesmith' },
  ]);
  const [chats] = useState([
    { id: 1, name: 'Alice Johnson', lastMessage: 'Hey, how are you?' },
    { id: 2, name: 'Bob Brown', lastMessage: 'Let’s catch up soon!' },
  ]);

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() === '') {
      setUsers([]); // Clear users if search is empty
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/search_users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchValue }),
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredUsers = (users || []).filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
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
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-results">No users found</p>
        )}
      </div>
      <div className="friend-requests-section">
        <h2>Incoming Friend Requests</h2>
        {friendRequests.length > 0 ? (
          <ul className="friend-requests-list">
            {friendRequests.map((request) => (
              <li key={request.id} className="friend-request-item">
                {request.name} (@{request.username})
                <button className="accept-btn">Accept</button>
                <button className="decline-btn">Decline</button>
              </li>
            ))}
          </ul>
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