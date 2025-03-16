
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebaseConfig";

const storage = getStorage(app);

export const uploadImage = async (file: File, userId: string): Promise<string> => {
  if (!file || !userId) {
    throw new Error('File and userId are required');
  }

  // Generate a unique ID for the image
  const imageId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const safeFileName = encodeURIComponent(file.name.replace(/[^a-zA-Z0-9.]/g, '_'));
  const filePath = `taskImages/${userId}/${imageId}-${safeFileName}`;
  const storageRef = ref(storage, filePath);
  
  try {
    console.log('Uploading image:', filePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Image uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

export { storage };
