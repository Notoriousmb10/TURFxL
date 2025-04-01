import React, { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
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
  const { user } = useUser();
  const { latitude, longitude } = useSelector((state) => state.location);
  const [isLooking, setIsLooking] = useState(
    JSON.parse(sessionStorage.getItem("isLooking")) || false
  );
  const [selectedGame, setSelectedGame] = useState("Football"); // State for selected game
  const [players, setPlayers] = useState([]);
  const [teamRequests, setTeamRequests] = useState([]);
  const [teams, setTeams] = useState([]); // Initialize teams state
  const [lobbyPlayers, setLobbyPlayers] = useState([]);
  const [teamChats, setTeamChats] = useState({});
  const [message, setMessage] = useState("");

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
        console.log("Current teams in Firestore:", teamsData);
        setTeams(teamsData);
      });

      return () => unsubscribe();
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "playersLooking"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const playerList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Current players in Firestore:", playerList);

        // Filter out the current user's matchmaking request
        const filteredPlayerList = playerList.filter(
          (player) => player.userId !== user.id
        );

        setPlayers(filteredPlayerList);
      });

      // Cleanup function to unsubscribe from Firestore listener
      return () => unsubscribe();
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      console.log("Fetching team requests for user:", user.id);

      const q = query(collection(db, "teamRequests"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("Snapshot size:", snapshot.size);
        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filteredRequests = requests.filter(
          (request) => request.fromUserId !== user.id
        );
        console.log("Fetched requests:", filteredRequests);

        setTeamRequests(filteredRequests);
      });
      // console.log(q)

      // Cleanup function to unsubscribe from Firestore listener
      return () => unsubscribe();
    }
  }, [user?.id]);

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

      // Cleanup function to unsubscribe from all listeners
      return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
    }
  }, [teams]);

  const toggleLooking = async () => {
    if (isLooking) {
      // Stop looking: Remove the user from Firestore
      const q = query(
        collection(db, "playersLooking"),
        where("userId", "==", user.id)
      );
      const querySnapshot = await getDocs(q); // Fetch matching documents
      querySnapshot.forEach(async (docItem) => {
        await deleteDoc(doc(db, "playersLooking", docItem.id));
      });

      setIsLooking(false);
      sessionStorage.setItem("isLooking", JSON.stringify(false));
    } else {
      // Start looking: Add the user to Firestore
      if (!latitude || !longitude) {
        alert(
          "Location data is not available. Please enable location services."
        );
        return;
      }

      try {
        const userInfo = {
          userId: user.id,
          name: user.firstName + " " + user.lastName,
          game: selectedGame, // Use the selected game
          location: { latitude, longitude },
          timeStamp: new Date(),
        };
        console.log("Adding user to Firestore:", userInfo);
        await addDoc(collection(db, "playersLooking"), userInfo);
        setIsLooking(true);
        sessionStorage.setItem("isLooking", JSON.stringify(true)); // Store the state in sessionStorage
      } catch (error) {
        console.error("Error adding document to Firestore:", error);
      }
    }
  };

  const sendTeamRequest = async (toUserId, game) => {
    try {
      const userInfo = {
        toUserId, // The user to whom the request is sent
        fromUserId: user.id,
        name: user.firstName + " " + user.lastName,
        game, // Use the provided game
        location: { latitude, longitude }, // Include location
        timeStamp: new Date(),
      };
      console.log("Adding team request to Firestore:", userInfo);
      await addDoc(collection(db, "teamRequests"), userInfo);
      console.log("Team request sent successfully!");
    } catch (error) {
      console.error("Error sending team request:", error);
    }
  };

  const handleTeamRequest = async (requestId, fromUserId, game, action) => {
    try {
      const requestRef = doc(db, "teamRequests", requestId);

      if (action === "accept") {
        // Create a new team
        const teamRef = collection(db, "teams");
        await addDoc(teamRef, {
          game,
          members: [user.id, fromUserId],
        });

        console.log("Team formed successfully!");
      }

      // Delete the request after processing
      await deleteDoc(requestRef);
      console.log(`Request ${action}ed successfully!`);
    } catch (error) {
      console.error("Error handling team request:", error);
    }
  };

  const leaveTeam = async (teamId) => {
    try {
      const teamRef = doc(db, "teams", teamId); // Correct DocumentReference
      const teamDoc = await getDoc(teamRef); // Use getDoc for a single document
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
      console.error("Error leaving the team:", error);
    }
  };

  const sendMessage = async (teamId) => {
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, "teamChats"), {
        teamId,
        senderId: user.id,
        senderName: user.firstName,
        text: message,
        timestamp: new Date(),
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchTurfs = async (team) => {
    console.log("Fetching turfs for team:", team);
    try {
      // Serialize and encode the team object
      const teamQueryParam = encodeURIComponent(JSON.stringify(team));
      console.log("Encoded team data:", teamQueryParam);

      const resp = await fetch(`http://localhost:5000/fetchTurfsForTeams?team=${teamQueryParam}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is OK
      if (!resp.ok) {
        const errorData = await resp.json();
        console.error("Error response from server:", errorData);
        throw new Error(`HTTP error! status: ${resp.status}, message: ${errorData.error || "Unknown error"}`);
      }

      const data = await resp.json();
      console.log("Fetched turfs:", data);
      setTeamsTurfs(data.nearby_turfs || []);
    } catch (error) {
      console.error("Error fetching turfs:", error.message);
      alert(`Failed to fetch turfs: ${error.message}`);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Find a Player</h2>

      {/* Toggle Button and Game Selector */}
      <div className="text-center mb-4 d-flex justify-content-center align-items-center gap-3">
        <Form.Select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)} // Update selected game
          style={{ width: "200px" }}
        >
          <option value="Football">Football</option>
          <option value="Cricket">Cricket</option>
          <option value="Basketball">Basketball</option>
          <option value="Tennis">Tennis</option>
        </Form.Select>
        <Button
          variant={isLooking ? "danger" : "primary"}
          onClick={toggleLooking}
        >
          {isLooking ? "Stop Looking for a Game" : "Find Players to Play"}
        </Button>
      </div>

      {isLooking && (
        <Row className="justify-content-center ">
          {players.map((player) => (
            <Col md={4} key={player.id} className="mb-3">
              <Card
                className=""
                style={{
                  backgroundImage: `url(${footballcardbg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Card.Body>
                  <Card.Title className="text-white">{player.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted text-white">
                    {player.game}
                  </Card.Subtitle>
                  {/* <Card.Text>{player.location}</Card.Text> */}
                  <Button
                    variant="success"
                    onClick={() => sendTeamRequest(player.userId, player.game)}
                  >
                    Form a Team
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {teamRequests.length > 0 &&
        teamRequests.map((req) => (
          <div key={req.id}>
            <p>
              {req.fromUserId} invited you to a {req.game} match!
            </p>
            <Button
              onClick={() =>
                handleTeamRequest(req.id, req.fromUserId, req.game, "accept")
              }
            >
              Accept
            </Button>
            <Button
              onClick={() =>
                handleTeamRequest(req.id, req.fromUserId, req.game, "reject")
              }
            >
              Reject
            </Button>
          </div>
        ))}

      {teams.length > 0 &&
        teams.map((team) => (
          <Card key={team.id} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-evenly align-items-center">
                <div>
                  <Card.Title>{team.game} Team</Card.Title>
                  <Card.Text>
                    <strong>Members:</strong>
                    <ul>
                      {team.members.map((member, index) => (
                        <li key={index}>{member}</li>
                      ))}
                    </ul>
                  </Card.Text>
                  <Button
                    variant="success"
                    style={{ backgroundColor: "red", padding: "4px" }}
                    onClick={() => leaveTeam(team.id)}
                    className="btn btn-danger"
                  >
                    Leave Team
                  </Button>
                  <Button
                    variant="success"
                    style={{ backgroundColor: "green", padding: "4px" }}
                    onClick={() => fetchTurfs(team)}
                    className="btn  ml-1 p-1"
                  >
                    Search For Turfs
                  </Button>
                </div>

                <div>
                  {/* Chat Section */}
                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      padding: "10px",
                      width: "800px",
                      maxHeight: "32rem",
                      minHeight: "20rem", // Fixed height for the chat box
                      overflowY: "scroll",
                    }}
                  >
                    <h5>Team Chat</h5>
                    <div>
                      {teamChats[team.id]?.map((chat, index) => (
                        <p
                          key={index}
                          style={{
                            backgroundColor:
                              chat.senderId === user.id ? "#d1e7dd" : "#f8d7da",
                            padding: "5px",
                            borderRadius: "5px",
                          }}
                        >
                          <strong>{chat.senderName}: </strong> {chat.text}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="d-flex mt-2">
                    <Form.Control
                      type="text"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevent default form submission
                          sendMessage(team.id); // Send the message
                        }
                      }}
                    />
                    <Button
                      variant="primary"
                      onClick={() => sendMessage(team.id)}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}

      {teamsTurfs.length > 0 && (
        <div className="mt-5">
          <h3 className="text-center mb-4">Nearby Turfs</h3>
          <Row className="justify-content-center">
            {teamsTurfs.map((turf, index) => (
              <Col md={4} key={turf.id} className="mb-3">
                <Card>
                  <Card.Img
                    variant="top"
                    src={turf.images[0]}
                    alt={turf.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{turf.name}</Card.Title>
                    <Card.Text>
                      <strong>City:</strong> {turf.city} <br />
                      <strong>Price/Hour:</strong> ₹{turf.price_per_hour} <br />
                      <strong>Rating:</strong> {turf.rating} ⭐ <br />
                      <strong>Discount:</strong> {turf.discount} <br />
                      <strong>Amenities:</strong> {turf.amenities.join(", ")} <br />
                      <strong>Available Slots:</strong> {turf.available_slots.join(", ")}
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => console.log(`Booking turf: ${turf.name}`)}
                    >
                      Book Turf
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default PlayerMatchingPage;
