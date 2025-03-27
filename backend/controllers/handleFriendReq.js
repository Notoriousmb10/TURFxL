import axios from "axios";

const handleFriendReq = async (req, res) => {
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

export default handleFriendReq;
