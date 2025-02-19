import { db } from "./firebase.js";  // Ensure correct import
import { collection, addDoc } from "firebase/firestore";
import { mumbaiTurfs } from "../utils/turfDataset.js";  // Ensure correct path

const uploadTurfsToFirestore = async () => {
  const turfsCollection = collection(db, "turfs"); // Reference Firestore collection

  try {
    for (const turf of mumbaiTurfs) {
      await addDoc(turfsCollection, turf);
      console.log(`✅ Added: ${turf.name}`);
    }
    console.log("🎉 All turfs uploaded successfully!");
  } catch (error) {
    console.error("❌ Error adding turfs:", error);
  }
};

// Execute the function only when the script is run
uploadTurfsToFirestore().then(() => {
  console.log("🔥 Upload process complete.");
  process.exit(0); // Exit script after completion (for Node.js)
});
