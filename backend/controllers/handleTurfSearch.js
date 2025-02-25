import axios from 'axios';

export const searchTurf = async (req, res) => {
  const { latitude, longitude, filter, min_price, max_price } = req.body;

  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/get_turfs?latitude=${latitude}&longitude=${longitude}&filter=${filter}&min_price=${min_price}&max_price=${max_price}`
    );
    res.json({ turfs: response.data.turfs });
  } catch (error) {
    console.error("Error fetching turfs:", error);
    res.status(500).json({ error: "Failed to fetch turfs" });
  }
};
