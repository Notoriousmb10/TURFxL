import axios from "axios";

const handleSendFriendReq = async (req, res) => {
  const { sendersUserId, receiversUserId } = req.body;
  console.log("📩 Sending friend request:", { sendersUserId, receiversUserId }); // Debugging log

  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/send_friend_request",
      { sendersUserId, receiversUserId }
    );
    console.log("✅ Friend request response:", response.data); // Debugging log
    res.json(response.data);
  } catch (error) {
    console.error(
      "❌ Error sending friend request:",
      error.response?.data || error.message
    ); // Debugging log
    res.status(500).json({ error: "Failed to send friend request" });
  }
};

const handleListOfReq = async (req, res) => {
  const { userId } = req.query; // Use query parameters for GET request
  console.log("📩 Fetching friend requests for user:", userId); // Debugging log

  if (!userId) {
    return res.status(400).json({ error: "Missing userId parameter" });
  }

  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/get_friend_requests?userId=${userId}`
    );
    console.log("✅ Friend requests fetched:", response.data); // Debugging log
    res.json(response.data); // Send the response back to the client
  } catch (error) {
    console.error(
      "❌ Error fetching friend requests:",
      error.response?.data || error.message
    ); // Debugging log
    res.status(500).json({ error: "Failed to fetch friend requests" });
  }
};

export { handleSendFriendReq, handleListOfReq };
