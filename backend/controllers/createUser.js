const axios = require("axios");

export default createUser = async (req, res) => {
  try {
    const { userData } = req.body;
    const response = await axios.post(
      `http://127.0.0.1:5000/create_user`,
      userData
    );
    res.json({ user: response.data.user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};
