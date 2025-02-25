import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "./firebase.js"; // Ensure correct import
import { collection, addDoc } from "firebase/firestore";
import { readdir, readFile } from "fs/promises";
import path from "path";

const storage = getStorage();
const turfsCollection = collection(db, "turfs");

const uploadImagesToFirebase = async () => {
  const imagesFolder = path.join(__dirname, "../assets/turfImages");

  try {
    const files = await readdir(imagesFolder);

    for (const file of files) {
      const filePath = path.join(imagesFolder, file);
      const fileBuffer = await readFile(filePath);
      const storageRef = ref(storage, `turfImages/${file}`);

      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, fileBuffer);
      console.log(`✅ Uploaded: ${file}`);

      // Get the public URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log(`✅ URL: ${downloadURL}`);

      // (Optional) Store the URL in Firestore
      await addDoc(turfsCollection, { imageName: file, imageUrl: downloadURL });
      console.log(`✅ Stored URL in Firestore for: ${file}`);
    }

    console.log("🎉 All images uploaded successfully!");
  } catch (error) {
    console.error("❌ Error uploading images:", error);
  }
};

// Execute the function only when the script is run
uploadImagesToFirebase().then(() => {
  console.log("🔥 Upload process complete.");
  process.exit(0); // Exit script after completion (for Node.js)
});
