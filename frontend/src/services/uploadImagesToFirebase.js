import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {mumbaiTurfs} from "../utils/turfDataset.js"; // Ensure you have this dataset imported

const storage = getStorage();
const turfsCollection = collection(db, "turfs"); // Ensure this matches your Firestore collection name

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadImagesToFirebase = async () => {
  const imagesFolder = path.join(__dirname, "../assets/turfImages");

  try {
    const files = await readdir(imagesFolder);
    const turfDocs = await getDocs(turfsCollection); // Get all existing turfs from Firestore

    for (const file of files) {
      const filePath = path.join(imagesFolder, file);

      try {
        // ✅ Read image as Buffer
        const fileBuffer = await readFile(filePath);

        // ✅ Sanitize filename
        const sanitizedFileName = file.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "");

        // ✅ Find matching turf entry from dataset (assuming dataset has 'name' matching filename)
        const turfEntry = mumbaiTurfs.find(turf => sanitizedFileName.includes(turf.name.replace(/\s+/g, "_")));

        if (!turfEntry) {
          console.warn(`⚠️ No matching turf found for: ${sanitizedFileName}`);
          continue; // Skip if no match
        }

        // ✅ Create storage reference
        const storageRef = ref(storage, `turfImages/${sanitizedFileName}`);

        // ✅ Upload image
        await uploadBytes(storageRef, fileBuffer);
        console.log(`✅ Uploaded: ${sanitizedFileName}`);

        // ✅ Get image URL
        const downloadURL = await getDownloadURL(storageRef);
        console.log(`✅ URL: ${downloadURL}`);

        // ✅ Find matching turf document in Firestore
        const matchingTurfDoc = turfDocs.docs.find(doc => doc.data().name === turfEntry.name);

        if (matchingTurfDoc) {
          // ✅ Update Firestore with image URL
          const turfDocRef = doc(db, "turf", matchingTurfDoc.id);
          await updateDoc(turfDocRef, { imageUrl: downloadURL });
          console.log(`✅ Updated Firestore for: ${turfEntry.name}`);
        } else {
          console.warn(`⚠️ Firestore entry not found for: ${turfEntry.name}`);
        }
      } catch (uploadError) {
        console.error(`❌ Error uploading file ${file}:`, uploadError);
      }
    }

    console.log("🎉 All images uploaded & Firestore updated successfully!");
  } catch (error) {
    console.error("❌ Error reading files:", error);
  }
};

// Execute the function only when the script is run
uploadImagesToFirebase().then(() => {
  console.log("🔥 Upload process complete.");
  process.exit(0); // Exit script after completion (for Node.js)
});
