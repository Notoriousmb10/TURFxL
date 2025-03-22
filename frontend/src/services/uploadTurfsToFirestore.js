import axios from 'axios';

const uploadTurfsToFirestore = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/upload_turfs');
    console.log(response.data.message);
  } catch (error) {
    console.error("❌ Error adding turfs:", error);
  }
};

// Execute the function only when the script is run
uploadTurfsToFirestore().then(() => {
  console.log("🔥 Upload process complete.");
  process.exit(0); // Exit script after completion (for Node.js)
});
