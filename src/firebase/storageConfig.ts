
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebaseConfig";

const storage = getStorage(app);

export const uploadImage = async (file: File, userId: string): Promise<string> => {
  if (!file || !userId) {
    throw new Error('File and userId are required');
  }

  const imageId = Date.now().toString();
  const safeFileName = encodeURIComponent(file.name.replace(/[^a-zA-Z0-9.]/g, '_'));
  const storageRef = ref(storage, `taskImages/${userId}/${imageId}-${safeFileName}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Image uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export { storage };
