
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebaseConfig";

const storage = getStorage(app);

export const uploadImage = async (file: File, userId: string): Promise<string> => {
  const imageId = Date.now().toString(); // Generate unique image ID
  const storageRef = ref(storage, `taskImages/${userId}/${imageId}-${file.name}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export { storage };
