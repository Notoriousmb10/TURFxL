import { db } from "./firebase.js"; // Ensure correct import
import { collection, addDoc } from "firebase/firestore";
import { userDataset } from "../utils/userDataset.js"; // Ensure correct path

const uploadUsersToFirestore = async () => {
  const usersCollection = collection(db, "users");

  try {
    for (const user of userDataset) {
      await addDoc(usersCollection, user);
      console.log(`✅ Added: ${user.name}`);
    }
    console.log("🎉 All users uploaded successfully!");
  } catch (error) {
    console.error("❌ Error adding users:", error);
  }
};

// Execute the function only when the script is run
uploadUsersToFirestore().then(() => {
  console.log("🔥 Upload process complete.");
  process.exit(0); // Exit script after completion (for Node.js)
});
