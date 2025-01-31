/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../Contexts/UseAuth";

const FavouriteContext = createContext();

export const useFavourites = () => {
  return useContext(FavouriteContext);
};

export const FavouriteProvider = ({ children }) => {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState([]);
  useEffect(() => {
    if (user?.uid) {
      const userRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        const userData = doc.data();
        setFavourites(userData.favourites || []); // Asigură-te că favorites este un array
      }, (error) => {
        console.error("Error fetching favourites:", error);
      });
      // Cleanup function
      return () => unsubscribe();
    }
  }, [user?.uid]);

  const toggleFavourite = async (flat) => {
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const updatedFavourites = favourites.some((f) => f.id === flat.id)
        ? favourites.filter((f) => f.id !== flat.id) // Remove flat if already a favourite
        : [...favourites, flat]; // Add flat if not a favourite

      await updateDoc(userRef, { favourites: updatedFavourites });
      setFavourites(updatedFavourites); // Update local state
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  const removeFavourite = (flatId) => {
    setFavourites((prevFavourites) =>
      prevFavourites.filter((flat) => flat.id !== flatId)
    );
  };

  return (
    <FavouriteContext.Provider value={{ favourites, toggleFavourite, removeFavourite }}>
      {children}
    </FavouriteContext.Provider>
  );
};
