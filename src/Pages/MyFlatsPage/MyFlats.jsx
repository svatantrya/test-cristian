import { useEffect } from "react";
import { useApartments } from "../../utilFunctions";
import Card from "../../Components/Card/Card";
import DisplayAmountOfApartments from "../../Components/DisplayAmountOfApartments/DisplayAmountOfApartments";
import useAuth from "../../Contexts/UseAuth";
import styles from "./MyFlats.module.css";
import { useNavigate } from "react-router-dom";

const MyFlats = () => {
  const { apartments, isLoading, error, fetchUserApartments, setApartments } = useApartments();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = fetchUserApartments(user.uid);
    return () => unsubscribe; // Call unsubscribe if it exists
  }, [fetchUserApartments, user.uid]);

  const handleClick = () => {
    navigate("/add-flat");
  };

  const handleDeleteFlat = (flatId) => {
    const updatedApartments = apartments.filter((flat) => flat.id !== flatId);
    setApartments(updatedApartments);
};

  return (
    <div className="main-body">
      <div className={styles.info}>
        <DisplayAmountOfApartments apartments={apartments} />
        <button type="button" className={styles.btn} onClick={handleClick}>
          Add Flat
        </button>
      </div>
      {isLoading ? (
        <div className="spinnerContainer">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p> // Display error message
      ) : (
        <div className="all-flats">
          {apartments.map((flat, index) => (
            <div key={index}>
              <Card flat={flat} showTrash={true} onDelete={handleDeleteFlat} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFlats;