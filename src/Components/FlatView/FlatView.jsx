import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import AddFlat from "../../Pages/AddFlat/AddFlat";
import styles from "./FlatView.module.css";
import { useFavourites } from "../../Contexts/FavouriteContext";
import useAuth from "../../Contexts/UseAuth";
import { formatTimestamp } from "../../utilFunctions";

const FlatView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { flat: initialFlat, owner } = location.state || { flat: {}, owner: {} }; // Obține datele din location.state
  const [flat, setFlat] = useState(initialFlat); // Stare locală pentru apartament
  const [messages, setMessages] = useState(flat.messages || []); // Stare pentru mesaje
  const [myMessages, setMyMessages] = useState([]);
  const [myMessagesVisibility, setMyMessagesVisibility] = useState(false);
  const [messagesVisibility, setMessagesVisibility] = useState(false);
  const [isMessageFormVisible, setIsMessageFormVisible] = useState(false);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const { favourites, toggleFavourite } = useFavourites();

  // Determină dacă apartamentul este favorit
  const isFavourite = favourites.some((f) => f.id === flat?.id);

  const handleDeleteClick = async () => {
    try {
      const userRef = doc(db, "users", flat.userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      // Elimină apartamentul din Firestore
      const updatedFlats = userData.flats.filter((f) => f.id !== flat.id);
      await updateDoc(userRef, { flats: updatedFlats });

      navigate("/my-flats"); // Navighează înapoi la lista de apartamente
    } catch (error) {
      console.error("Error deleting flat:", error);
    }
  };

  // const handleUpdateClose = async (updatedFlat) => {
  //   try {
  //     const flatRef = doc(db, "flats", updatedFlat.id); // Asigură-te că ai referința corectă
  //     const flatDoc = await getDoc(flatRef);
  //     const flatData = flatDoc.data();
  
  //     setFlat(flatData); // Actualizează apartamentul local cu datele actualizate
  //     setIsUpdateFormVisible(false); // Ascunde formularul de actualizare
  //   } catch (error) {
  //     console.error("Error fetching updated flat:", error);
  //   }
  // };

  const handleUpdateClose = async (updatedFlat) => {
    try {
      const flatRef = doc(db, "flats", updatedFlat.id); // Referința la apartament
      const userRef = doc(db, "users", updatedFlat.userId); // Referința la utilizator
  
      // Obține documentul utilizatorului
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
  
      // Actualizează apartamentul în lista de flats
      const updatedFlats = userData.flats.map((flat) =>
        flat.id === updatedFlat.id ? updatedFlat : flat
      );
  
      // Verifică dacă apartamentul este în favourites și actualizează-l
      const updatedFavourites = userData.favourites.map((fav) =>
        fav.id === updatedFlat.id ? updatedFlat : fav
      );
  
      // Actualizează documentul utilizatorului
      await updateDoc(userRef, {
        flats: updatedFlats,
        favourites: updatedFavourites,
      });
  
      // Actualizează starea locală
      setFlat(updatedFlat); // Actualizează apartamentul local cu datele actualizate
      setIsUpdateFormVisible(false); // Ascunde formularul de actualizare
    } catch (error) {
      console.error("Error updating flat:", error);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const actualTime = formatTimestamp(timestamp);
    const newMessage = {
      date: actualTime,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      messageText: e.target.messageText.value,
      id:user.uid,
    };

    try {
      const userRef = doc(db, "users", owner.id);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const flats = userData.flats;
      const flatIndex = flats.findIndex((f) => f.id === flat.id);

      if (flatIndex !== -1) {
        flats[flatIndex].messages = [...(flats[flatIndex].messages || []), newMessage];
        await updateDoc(userRef, { flats });
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }

      setIsMessageFormVisible(false); // Ascunde formularul de mesaje
    } catch (error) {
      console.error("Message not sent: ", error);
    }
  };

  const toggleMessageForm = () => {
    setIsMessageFormVisible((prev) => !prev);
    setMyMessagesVisibility(false);
  };

  const readMessages = () => {
    setMessagesVisibility((prev) => !prev);
  };

  const readMyMessages = () => {
    const myOwnMessages = (messages || []).filter((message) => message.id === user.uid);
    setMyMessages(myOwnMessages);
    setMyMessagesVisibility((prev) => !prev);
    setIsMessageFormVisible(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.picture}>
        <img src={flat.image} alt={`${flat.city} flat`} />
        {isFavourite ? (
          <FaHeart
            className={`${styles.heart} ${styles.active}`}
            onClick={() => toggleFavourite(flat)}
          />
        ) : (
          <FaRegHeart className={styles.heart} onClick={() => toggleFavourite(flat)} />
        )}
        {user.uid === flat.userId && (
          <CiTrash className={styles.trash} onClick={handleDeleteClick} />
        )}
      </div>
      <div className={styles.info}>
        <p>City: {flat.city}</p>
        <p>
          Street: {flat.street} {flat.number}
        </p>
        <p>Year: {flat.year}</p>
        <p>Area: {flat.area} m2</p>
        <p>Rent: €{flat.rent}/mo</p>
        <p>Available: {flat.available}</p>
        <p className="ownerInfo">
          Owner: {owner.firstName} {owner.lastName}
        </p>
        <p className="ownerInfo">Email: {owner.email}</p>
        {user.uid === flat.userId ? (
          <div className={styles.buttonsArea}>
            <button onClick={readMessages}>
              {messagesVisibility ? "Close Messages" : "Read Messages"}
            </button>
            <button onClick={() => setIsUpdateFormVisible(true)}>Update</button>
            {isUpdateFormVisible && (
              <AddFlat
                existingFlat={flat}
                onClose={() => setIsUpdateFormVisible(false)}
                onUpdate={handleUpdateClose} // Actualizează apartamentul local
              />
            )}
          </div>
        ) : (
          <div className={styles.buttonsArea}>
            <button onClick={toggleMessageForm}>
              {isMessageFormVisible ? "Close Form" : "Send a Message"}
            </button>
            <button onClick={readMyMessages}>
              {myMessagesVisibility ? "Close My Messages" : "Read My Messages"}
            </button>
          </div>
        )}
        {myMessagesVisibility && 
          <div className={styles.messageList}>
            {myMessages.length > 0 ? (
              myMessages.map((msg, index) => (
                <div key={index} className={styles.messageItem}>
                  <p>Date: {msg.date}</p>
                  <p>Message: {msg.messageText}</p>
                </div>
              ))) : (
                <p>No message sent for this flat.</p>
            )}
          </div>
        }
        {messagesVisibility && (
          <div className={styles.messageList}>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className={styles.messageItem}>
                  <p>Date: {msg.date}</p>
                  <p>From: {msg.firstName} {msg.lastName}</p>
                  <p>Email: {msg.email}</p>
                  <p>Message: {msg.messageText}</p>
                </div>
              ))
            ) : (
              <p>No messages found.</p>
            )}
          </div>
        )}
        {isMessageFormVisible && (
          <form className={ styles.messageForm } onSubmit={handleMessageSubmit}>
            <textarea name="messageText" placeholder="Write a message..." required></textarea>
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FlatView;
