import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import auth, { db } from "../firebase.js";

const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
  birthDate,
}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    const userData = {
      firstName,
      lastName,
      email,
      birthDate,
      isAdmin: false,
      flats: [],
      favourites: [],
      createdAt: new Date().toISOString(),
      id: uid,
    };

    await setDoc(doc(db, "users", uid), userData);

    console.log("User registered successfully:", userData);
    return { success: true, data: userData };
  } catch (error) {
    console.error("Error during registration:", error.message);
    return { success: false, error: error.message };
  }
};

export default registerUser;
