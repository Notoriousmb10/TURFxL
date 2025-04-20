import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  db,
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  getDocs,
} from "../services/firebase";
import { useSelector } from "react-redux";
import footballcardbg from "../assets/turfImages/footballcardbg.jpeg";

const PlayerMatchingPage = () => {
  const [teamsTurfs, setTeamsTurfs] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();
  const { latitude, longitude } = useSelector((state) => state.location);
  const [isLooking, setIsLooking] = useState(
    JSON.parse(sessionStorage.getItem("isLooking")) || false
  );
  const [selectedGame, setSelectedGame] = useState("Football");
  const [players, setPlayers] = useState([]);
  const [teamRequests, setTeamRequests] = useState([]);
  const [teams, setTeams] = useState([]);
  const [lobbyPlayers, setLobbyPlayers] = useState([]);
  const [teamChats, setTeamChats] = useState({});
  const [message, setMessage] = useState("");

  // Fetch user's teams
  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "teams"),
        where("members", "array-contains", user.id)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const teamsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeams(teamsData);
      });
      return () => unsubscribe();
    }
  }, [user?.id]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  // Fetch players looking for a game (exclude current user)
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "playersLooking"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const playerList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filteredPlayerList = playerList.filter(
          (player) => player.userId !== user.id
        );
        setPlayers(filteredPlayerList);
      });
      return () => unsubscribe();
    }
  }, [user?.id]);

  // Fetch team requests
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "teamRequests"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filteredRequests = requests.filter(
          (request) => request.fromUserId !== user.id
        );
        setTeamRequests(filteredRequests);
      });
      return () => unsubscribe();
    }
  }, [user?.id]);

  // Fetch lobby players for the selected game
  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "lobby"),
        where("game", "==", selectedGame)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const players = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLobbyPlayers(players);
      });
      return () => unsubscribe();
    }
  }, [user?.id, selectedGame]);

  // Fetch team chats for each team
  useEffect(() => {
    if (teams.length > 0) {
      const unsubscribes = teams.map((team) => {
        const q = query(
          collection(db, "teamChats"),
          where("teamId", "==", team.id)
        );
        return onSnapshot(q, (snapshot) => {
          setTeamChats((prevChats) => ({
            ...prevChats,
            [team.id]: snapshot.docs.map((doc) => doc.data()),
          }));
        });
      });
      return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
    }
  }, [teams]);

  // Toggle looking status (start/stop)
  const toggleLooking = async () => {
    if (isLooking) {
      const q = query(
        collection(db, "playersLooking"),
        where("userId", "==", user.id)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docItem) => {
        await deleteDoc(doc(db, "playersLooking", docItem.id));
      });
      setIsLooking(false);
      sessionStorage.setItem("isLooking", JSON.stringify(false));
    } else {
      if (!latitude || !longitude) {
        alert(
          "Location data is not available. Please enable location services."
        );
        return;
      }
      if (user) {
        try {
          const userInfo = {
            userId: user.id,
            name: user.firstName + " " + user.lastName,
            game: selectedGame,
            location: { latitude, longitude },
            timeStamp: new Date(),
          };
          await addDoc(collection(db, "playersLooking"), userInfo);
          setIsLooking(true);
          sessionStorage.setItem("isLooking", JSON.stringify(true));
        } catch (error) {
          console.error("Error adding document:", error);
        }
      } else {
        alert("User not found. Please log in.");
      }
    }
  };

  // Send team request
  const sendTeamRequest = async (toUserId, game) => {
    try {
      const userInfo = {
        toUserId,
        fromUserId: user.id,
        name: user.firstName + " " + user.lastName,
        game,
        location: { latitude, longitude },
        timeStamp: new Date(),
      };
      await addDoc(collection(db, "teamRequests"), userInfo);
    } catch (error) {
      console.error("Error sending team request:", error);
    }
  };

  // Handle team request (accept/reject)
  const handleTeamRequest = async (requestId, fromUserId, game, action) => {
    try {
      const requestRef = doc(db, "teamRequests", requestId);
      if (action === "accept") {
        const teamRef = collection(db, "teams");
        await addDoc(teamRef, {
          game,
          members: [user.id, fromUserId],
        });
      }
      await deleteDoc(requestRef);
    } catch (error) {
      console.error("Error handling team request:", error);
    }
  };

  // Leave team
  const leaveTeam = async (teamId) => {
    try {
      const teamRef = doc(db, "teams", teamId);
      const teamDoc = await getDoc(teamRef);
      if (teamDoc.exists()) {
        const teamData = teamDoc.data();
        const updatedMembers = teamData.members.filter(
          (member) => member !== user.id
        );
        await updateDoc(teamRef, { members: updatedMembers });
        alert("Left the team successfully!");
      } else {
        console.log("Team not found!");
      }
    } catch (error) {
      console.error("Error leaving team:", error);
    }
  };

  // Send chat message
  const sendMessage = async (teamId) => {
    if (!message.trim()) return;
    try {
      await addDoc(collection(db, "teamChats"), {
        teamId,
        senderId: user.id,
        senderName: `${user.firstName} ${user.lastName}`, // Send user's name
        text: message,
        timestamp: new Date(),
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Fetch nearby turfs
  const fetchTurfs = async (team) => {
    try {
      const teamQueryParam = encodeURIComponent(JSON.stringify(team));
      const resp = await fetch(
        `http://localhost:5000/fetchTurfsForTeams?team=${teamQueryParam}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(
          `HTTP error! status: ${resp.status}, message: ${
            errorData.error || "Unknown error"
          }`
        );
      }
      const data = await resp.json();
      const turfs = data.nearby_turfs || [];
      setTeamsTurfs(turfs);
      sessionStorage.setItem("teamsTurfs", JSON.stringify(turfs)); // Store turfs in sessionStorage
    } catch (error) {
      console.error("Error fetching turfs:", error.message);
      alert(`Failed to fetch turfs: ${error.message}`);
    }
  };

  // Load turfs from sessionStorage on component mount
  useEffect(() => {
    const storedTurfs = sessionStorage.getItem("teamsTurfs");
    if (storedTurfs) {
      setTeamsTurfs(JSON.parse(storedTurfs));
    }
  }, []);

  const handleBookTurf = async (turf) => {
    const tour = {
      title: turf.name,
      city: turf.city,
      photo: turf.images[0],
      price: turf.price_per_hour,
      desc: "A great place to play!",
      address: turf.address || "Address not available",
      maxGroupSize: turf.max_group_size || 10,
    };

    const allTeamMembers = teams.flatMap((team) => team.members);

    try {
      console.log("Sending user IDs to backend:", allTeamMembers); // Debug log
      const response = await fetch("http://localhost:5000/getUserNames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: allTeamMembers }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user names: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Received user names from backend:", data); // Debug log
      const userIdToNameMap = data.userNames || {};

      const teamMembers = allTeamMembers.map(
        (userId) => userIdToNameMap[userId] || userId // Use name if available, fallback to ID
      );

      navigate("/turfs/bookturf", {
        state: { tour, teamMembers },
      });
    } catch (error) {
      console.error("Error fetching user names:", error.message);
      alert("Failed to fetch team member names. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Find a Player</h2>

      {/* Toggle Button and Game Selector */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="w-48 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Football">Football</option>
          <option value="Cricket">Cricket</option>
          <option value="Basketball">Basketball</option>
          <option value="Tennis">Tennis</option>
        </select>
        <button
          onClick={toggleLooking}
          className={`px-4 py-2 rounded-md text-white ${
            isLooking
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLooking ? "Stop Looking for a Game" : "Find Players to Play"}
        </button>
      </div>

      {/* Display Players Looking */}
      {isLooking && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {players.map((player) => (
            <div
              key={player.id}
              className="relative rounded-lg shadow-lg overflow-hidden"
              style={{
                backgroundImage: `url(${footballcardbg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="bg-black bg-opacity-50 p-4">
                <h3 className="text-xl text-white font-semibold">
                  {player.name}
                </h3>
                <p className="text-gray-200">{player.game}</p>
                <button
                  onClick={() => sendTeamRequest(player.userId, player.game)}
                  className="mt-3 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                >
                  Form a Team
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team Requests */}
      {teamRequests.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Team Requests</h3>
          {teamRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between bg-gray-100 p-4 rounded mb-3"
            >
              <p>
                <span className="font-semibold">{req.fromUserId}</span> invited
                you to a <span className="font-semibold">{req.game}</span>{" "}
                match!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    handleTeamRequest(
                      req.id,
                      req.fromUserId,
                      req.game,
                      "accept"
                    )
                  }
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    handleTeamRequest(
                      req.id,
                      req.fromUserId,
                      req.game,
                      "reject"
                    )
                  }
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Teams & Chat Section */}
      {teams.length > 0 &&
        teams.map((team) => (
          <div key={team.id} className="bg-white shadow rounded-lg mb-8 p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              {/* Team Info */}
              <div className="w-full md:w-1/3">
                <h3 className="text-2xl font-semibold mb-3">
                  {team.game} Team
                </h3>
                <p className="mb-2">
                  <strong>Members:</strong>
                </p>
                <ul className="list-disc ml-5 mb-4">
                  {team.members.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <button
                    onClick={() => leaveTeam(team.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Leave Team
                  </button>
                  <button
                    onClick={() => fetchTurfs(team)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                  >
                    Search For Turfs
                  </button>
                </div>
              </div>

              {/* Team Chat */}
              <div className="w-full md:w-2/3 flex flex-col">
                <div className="border border-gray-300 rounded-lg p-4 h-80 overflow-y-auto mb-4">
                  <h5 className="text-xl font-semibold mb-3">Team Chat</h5>
                  {teamChats[team.id]?.map((chat, index) => (
                    <p
                      key={index}
                      className={`p-2 rounded mb-2 ${
                        chat.senderId === user.id
                          ? "bg-green-100 text-green-800 self-end"
                          : "bg-red-100 text-red-800 self-start"
                      }`}
                    >
                      <strong>{chat.senderName}: </strong> {/* Use senderName */}
                      {chat.text}
                    </p>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage(team.id);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => sendMessage(team.id)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Turf Results */}
      {teamsTurfs.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-center mb-6">
            Nearby Turfs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamsTurfs.map((turf) => (
              <div
                key={turf.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <img
                  src={turf.images[0]}
                  alt={turf.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold mb-2">{turf.name}</h4>
                  <p className="text-gray-700 mb-1">
                    <strong>City:</strong> {turf.city}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Price/Hour:</strong> ₹{turf.price_per_hour}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Rating:</strong> {turf.rating} ⭐
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Discount:</strong> {turf.discount}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Amenities:</strong> {turf.amenities.join(", ")}
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>Available Slots:</strong>{" "}
                    {turf.available_slots.join(", ")}
                  </p>
                  <button
                    onClick={() => handleBookTurf(turf)}
                    className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    Book Turf
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerMatchingPage;
