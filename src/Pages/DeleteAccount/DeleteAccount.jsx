import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { getAuth, signOut, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import useAuth from "../../Contexts/UseAuth";
import { db } from "../../firebase";
import styles from "./DeleteAccount.module.css";

const DeleteAccount = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const { logout } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [password, setPassword] = useState(""); // Parola introdusă de utilizator
  const navigate = useNavigate();

  const reauthenticateUser = async () => {
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      console.log("Re-authentication successful.");
    } catch (error) {
      console.error("Error re-authenticating user:", error.message);
      throw new Error("Re-authentication failed. Please check your password.");
    }
  };

  const deleteUser = async () => {
    if (user) {
      try {
        // Re-autentifică utilizatorul înainte de a continua
        await reauthenticateUser();

        // Șterge utilizatorul din Firestore
        await deleteDoc(doc(db, "users", user.uid));

        // Șterge utilizatorul din Firebase Authentication
        await user.delete();

        // Deloghează utilizatorul
        await signOut(auth);
        logout();
        console.log("User has been deleted and logged-out successfully.");
        navigate("/");
      } catch (error) {
        console.error("Error in deleting user:", error.message);
        alert(error.message);
      }
    } else {
      console.log("There is no user authenticated.");
    }
  };

  const handleDeleteClick = () => {
    setConfirmDelete(true); // Afișează mesajul de confirmare
  };

  const handleCancelClick = () => {
    setConfirmDelete(false); // Ascunde mesajul de confirmare
  };

  return (
    <div className={styles.container}>
      {confirmDelete ? (
        <div>
          <h3>Are you sure you want to delete this account?</h3>
          <p>Please re-enter your password to confirm:</p>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles["button-container"]}>
            <button className={styles.button} onClick={deleteUser}>
              Delete Account
            </button>
            <button
              className={`${styles.button} ${styles["cancel-button"]}`}
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3>This account is about to be deleted</h3>
          <button className={styles.button} onClick={handleDeleteClick}>
            Delete Account
          </button>
        </>
      )}
    </div>
  );
};

export default DeleteAccount;
