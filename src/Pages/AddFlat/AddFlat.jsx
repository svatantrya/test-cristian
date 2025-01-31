/* eslint-disable react/prop-types */

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { arrayUnion, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import useAuth from "../../Contexts/UseAuth";
import styles from "./AddFlat.module.css";
import "../Authentication/authentication.css";
import {
  validateCityNameField,
  validateStreetNameField,
  validateStreetNumberField,
  validateAreaField,
  validateYearField,
  validateRentField,
  validateDateAvailableField,
} from "../../utilFunctions";
import validateFlatForm from "../Authentication/FlatValidation";
import { updateDoc } from "firebase/firestore";

const AddFlat = ({ existingFlat, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flat, setFlat] = useState(
    existingFlat || {
      city: "",
      street: "",
      number: "",
      area: "",
      hasAC: "",
      year: "",
      rent: "",
      available: "",
      isFavourite: true,
      messages: [],
    }
  );

  const [errors, setErrors] = useState({
    city: "",
    street: "",
    number: "",
    area: "",
    year: "",
    rent: "",
    available: "",
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null); // Folosim useRef pentru a accesa input-ul de tip file

  const handleClose = () => {
    navigate("/my-flats");
  };

  const registerFlat = async (newFlat) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const newFlatWithId = { ...newFlat, id: uuidv4(), userId: user.uid };
      await updateDoc(userDocRef, {
        flats: arrayUnion(newFlatWithId),
        favourites: arrayUnion(newFlatWithId),
      });
      console.log("Flat added successfully:", newFlatWithId);
    } catch (error) {
      console.error("Error adding flat to user:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    const isValid = validateFlatForm(flat, validationErrors);
  
    if (isUploadingImage) {
      alert("Image is still uploading. Please wait before submitting.");
      return; // Nu continua dacă imaginea este încă în curs de încărcare
    }
    
    if (!isValid) {
      setErrors(validationErrors);
      alert("Please fill out the red marked field(s)");
      return;
    }
  
    setErrors({});
  
    try {
      const userDocRef = doc(db, "users", user.uid);
  
      if (existingFlat) {
        // Actualizează apartamentul existent
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        const updatedFlats = userData.flats.map((f) =>
          f.id === existingFlat.id ? { ...flat, id: existingFlat.id } : f
        );
        await updateDoc(userDocRef, { flats: updatedFlats });
        console.log("Flat updated successfully:", flat);
      } else {
        // Adaugă un apartament nou
        await registerFlat(flat);
      }
  
      // Resetează formularul
      setFlat({
        city: "",
        street: "",
        number: "",
        area: "",
        hasAC: "",
        year: "",
        rent: "",
        available: "",
        messages: [],
        image: "",
      });
      if (typeof onUpdate === "function") {
        onUpdate(flat);
      }
      fileInputRef.current.value = null;
      onClose?.();
      navigate(-1);
    } catch (error) {
      console.error("Error updating or adding flat:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlat((prevData) => ({ ...prevData, [name]: value }));

    let errorField = null;
    switch (name) {
      case "city":
        errorField = validateCityNameField(value);
        break;
      case "street":
        errorField = validateStreetNameField(value);
        break;
      case "number":
        errorField = validateStreetNumberField(value);
        break;
      case "area":
        errorField = validateAreaField(value);
        break;
      case "year":
        errorField = validateYearField(value);
        break;
      case "rent":
        errorField = validateRentField(value);
        break;
      case "available":
        errorField = validateDateAvailableField(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorField }));
  };

  const handleImageChange = async (e) => {
    const image = e.target.files[0]; // Fișierul selectat
    if (image) {
      const storage = getStorage(); // Obține instanța Storage
      const storageRef = ref(storage, `flats/${image.name}`); // Creează un path în Storage
      setIsUploadingImage(true);
      try {
        // Încarcă imaginea în Storage
        await uploadBytes(storageRef, image);

        // Obține URL-ul descărcabil al imaginii
        const downloadURL = await getDownloadURL(storageRef);
        console.log("url", downloadURL);

        // Actualizează starea apartamentului cu URL-ul imaginii
        setFlat((prevFlat) => ({ ...prevFlat, image: downloadURL }));
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
      finally {
        setIsUploadingImage(false);
      }
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles["modal-content"]}>
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <h1>Add apartment</h1>
        <form className="add-app-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="city"
            value={flat.city}
            placeholder="City"
            onChange={handleChange}
            required
          />
          <div className={styles.error}>{errors.city}</div>
          <input
            type="text"
            name="street"
            value={flat.street}
            placeholder="Street"
            onChange={handleChange}
            required
          />
          <div className={styles.error}>{errors.street}</div>
          <input
            type="number"
            name="number"
            value={flat.number}
            placeholder="Number"
            onChange={handleChange}
            required
          ></input>
          <div className={styles.error}>{errors.number}</div>
          <input
            type="number"
            name="area"
            value={flat.area}
            placeholder="Area"
            onChange={handleChange}
            required
          ></input>
          <div className={styles.error}>{errors.area}</div>
          <div style={{ textAlign: "left", marginLeft: "1.1rem" }}>
            <label htmlFor="ac">Has AC:</label>
            <input
              type="checkbox"
              className={styles.ac}
              name="hasAC"
              checked={flat.hasAC}
              onChange={handleChange}
            ></input>
          </div>
          <input
            type="number"
            name="year"
            value={flat.year}
            placeholder="Year"
            onChange={handleChange}
            required
          ></input>
          <div className={styles.error}>{errors.year}</div>
          <input
            type="number"
            name="rent"
            value={flat.rent}
            placeholder="Rent"
            onChange={handleChange}
            required
          ></input>
          <div className={styles.error}>{errors.rent}</div>
          <input
            type="date"
            name="available"
            value={flat.available}
            placeholder="Date Available"
            onChange={handleChange}
            required
          ></input>
          <div className={styles.error}>{errors.available}</div>
          <div style={{ textAlign: "left", marginLeft: "1.1rem" }}>
            <label htmlFor="picture-select">Select Picture:</label>
            <input
              type="file"
              id="picture-select"
              name="image"
              accept="images/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            ></input>
          </div>
          <button type="submit" className="submit-form">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFlat;
