import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import useAuth from "../../Contexts/UseAuth";
import styles from "./MyProfile.module.css";

const MyProfile = () => {
  const { user } = useAuth(); // Utilizatorul autentificat
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    // Ascultă modificările în timp real pentru datele utilizatorului
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      } else {
        console.error("User document not found");
      }
    });

    // Dezabonează-te de la ascultare la demontarea componentei
    return () => unsubscribe();
  }, [user?.uid]);

  const handleEdit = () => {
    navigate(`/edit-user/${user.uid}`);
  };

  if (!userData) {
    return (
      <div className="spinnerContainer">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>User Profile</h2>
      <div className={styles.userInfo}>
        <p>
          <strong>First Name:</strong> {userData.firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {userData.lastName}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Birth Date:</strong> {userData.birthDate}
        </p>
      </div>
      <button className={styles.editButton} onClick={handleEdit}>
        Edit Profile
      </button>
    </div>
  );
};

export default MyProfile;
