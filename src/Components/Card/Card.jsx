/* eslint-disable react/prop-types */
import useAuth from "../../Contexts/UseAuth";
import styles from "./Card.module.css";
import { getOwnerData } from "../../utilFunctions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useFavourites } from "../../Contexts/FavouriteContext";

const Card = ({ flat, showTrash, onDelete }) => {
  const [owner, setOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { favourites, toggleFavourite, removeFavourite } = useFavourites();
  const navigate = useNavigate();

  // Fetch owner data
  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const ownerData = await getOwnerData(flat);
        setOwner(ownerData);
      } catch (error) {
        console.error("Error fetching owner data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOwnerData();
  }, [flat]);

  const isMyApartment = (owner?.id === user?.id);

  // Verifică dacă apartamentul este favorit
  const isFavourite = favourites.some((f) => f.id === flat.id);
  
  const handleHeartClick = () => {
    toggleFavourite(flat);
  };

  const handleDetailsClick = () => {
    navigate(`/flat/:${flat.id}`, {
      state: {
        flat,
        owner,
      },
    });
  };

  const handleDeleteClick = async() => {
    if (!window.confirm("Are you sure you want to delete this flat?")) {
      return; // Dacă utilizatorul anulează acțiunea
    }
    try {
      console.log(owner)
      const userRef = doc(db, "users", flat.userId);
      const userDoc = await getDoc(userRef);
 
      if (!userDoc.exists()) {
        console.error("User document does not exist.");
        return;
      }
      const userData = userDoc.data();
      const updatedFlats = userData.flats.filter((f) => f.id !== flat.id); // Elimină apartamentul din lista curentă
      const updatedFavourites = userData.favourites.filter((f) => f.id !== flat.id); 
      await updateDoc(userRef, {
        flats: updatedFlats,
        favourites: updatedFavourites,
      });
      onDelete(flat.id);
      removeFavourite(flat.id); 
      alert("Flat deleted successfully!");
    } catch (error) {
      console.error("Error deleting flat:", error);
      alert("Failed to delete flat. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="spinnerContainer">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.picture}>
        <img src={flat.image} alt={`${flat.city} flat`} />
        {isAuthenticated && (
          <>
            {isFavourite ? (
              <FaHeart
                className={`${styles.heart} ${styles.active}`}
                onClick={handleHeartClick}
              />
            ) : (
              <FaRegHeart className={styles.heart} onClick={handleHeartClick} />
            )}
            {isMyApartment && showTrash && (
              <CiTrash className={styles.trash} onClick={handleDeleteClick} />
            )}
          </>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.location}>
          <p>City: {flat.city}</p>
          <p>
            Street: {flat.street} {flat.number}
          </p>
        </div>
        <div className={styles["info-flat"]}>
          <p>Year: {flat.year}</p>
          <p>Area: {flat.area} m2</p>
          <p>AC: {flat.hasAC === "on" ? "Yes" : "No"}</p>
        </div>
        <div className={styles["info-flat"]}>
          <p>
            Rent:
            {isAuthenticated ? (
              <span> €{flat.rent}/mo</span>
            ) : (
              <span style={{ color: "var(--maroon)" }}> -</span>
            )}
          </p>
          <p>Available: {flat.available}</p>
        </div>
      </div>
      <div className={styles.bottom}>
        {isAuthenticated ? (
          <div>
            <h5 className={styles.ownerInfo}>
              Owner: {owner?.firstName} {owner?.lastName}{" "}
            </h5>
            <h5 className={styles.ownerInfo}>Email: {owner ? owner.email : ""}</h5>
          </div>
        ) : (
          <h5 className={styles["invite-to-login"]}>
            Please Login for Details
          </h5>
        )}
        <div>
          {isAuthenticated && (
            <button type="submit" onClick={handleDetailsClick}>
              Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
