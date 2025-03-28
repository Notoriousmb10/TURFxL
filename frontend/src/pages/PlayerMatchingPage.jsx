import React, { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { useUser } from "@clerk/clerk-react";
import {
  db,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "../services/firebase";
import { useSelector } from "react-redux";

const PlayerMatchingPage = () => {
  const { user } = useUser();
  const { latitude, longitude } = useSelector((state) => state.location);
  const [isLooking, setIsLooking] = useState(JSON.parse(localStorage.getItem("isLooking")) || false); // State to track if the user is looking for a game
  const [selectedGame, setSelectedGame] = useState("Football"); // State for selected game
  const [players, setPlayers] = useState([]);

  useEffect(() => {

    const q = query(collection(db, "playersLooking"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const playerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayers(playerList);
    });
    return () => unsubscribe();
    }, []);




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
      localStorage.setItem("isLooking",JSON.stringify(false)); 
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
          name: user.firstName,
          game: selectedGame, // Use the selected game
          location: { latitude, longitude },
          timeStamp: new Date(),
        };
        console.log("Adding user to Firestore:", userInfo);
        await addDoc(collection(db, "playersLooking"), userInfo);
        setIsLooking(true);
        localStorage.setItem("isLooking",JSON.stringify(true)); // Store the state in localStorage
      } catch (error) {
        console.error("Error adding document to Firestore:", error);
      }
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

      {/* List of Available Players */}
      {isLooking && (
        <Row className="justify-content-center">
          {players.map((player) => (
            <Col md={4} key={player.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{player.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {player.game}
                  </Card.Subtitle>
                  {/* <Card.Text>{player.location}</Card.Text> */}
                  <Button variant="success">Request to Play</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default PlayerMatchingPage;
