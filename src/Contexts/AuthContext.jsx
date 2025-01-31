/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    console.log(userData)
    setIsAuthenticated(true);
    setUser(userData);
    setIsAdmin(userData.isAdmin);
    localStorage.setItem("user", JSON.stringify(userData)); // Persistăm utilizatorul in caz de refresh
  };
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user"); // Șterge utilizatorul
    localStorage.removeItem("COUNTDOWN_KEY");
  };

  const fetchUserDetails = async (uid) => {
    if (!uid) {
      console.error("UID is missing, cannot fetch user details.");
      return null;
    }
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data(); // Returnează datele complete ale utilizatorului
      }
      return null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
      setIsAdmin(storedUser.isAdmin);
  
      if (!storedUser.favourites || !storedUser.flats) {
        fetchUserDetails(storedUser.uid).then((fullUserData) => {
          if (fullUserData) {
            setUser(fullUserData);
            localStorage.setItem("user", JSON.stringify(fullUserData)); // Actualizează localStorage
          } else {
            console.warn("User not found in Firestore, logging out...");
            logout(); // Deconectează utilizatorul dacă nu mai există în baza de date
          }
        });
      }
    }
  }, []);
  
  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, login, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
