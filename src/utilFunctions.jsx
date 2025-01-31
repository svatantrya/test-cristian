import { useCallback, useReducer } from "react";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { apartmentReducer, userReducer } from "./Reducers";

//VALIDATE FUNCTIONS
export function validateFirstNameField(firstName) {
  const namePattern = /^([a-zA-Z]{2,})/;
  if (!namePattern.test(firstName)) {
    return "First name must be at least 2 characters long.";
  }
  return null;
}

export function validateLastNameField(lastName) {
  const namePattern = /^([a-zA-Z]{2,})/;
  if (!namePattern.test(lastName)) {
    return "Last name must be at least 2 characters long.";
  }
  return null;
}

export function validateEmailField(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return "Invalid email format.";
  }
  return null;
}

export function validatePasswordField(password) {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;
  if (!passwordPattern.test(password)) {
    return "Password must be at least 6 characters long, contains letters, numbers, and special characters.";
  }
  return null;
}

export function validateSamePasswordField(password, secondEntryPassword) {
  if (password !== secondEntryPassword) {
    return "Password do not match.";
  }
  return null;
}

export function validateBirthDateField(birthDate) {
  const birthDateObj = new Date(birthDate);
  const today = new Date();
  const age = (today.getTime() - birthDateObj.getTime()) / 31536000000; //Number of miliseconds in an year
  if (age < 18 || age > 120) {
    return "Age must be between 18 and 120.";
  }
  return null;
}

export async function testIfRegistered(email) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

//ADD APARTMENTS PAGE FUNCTIONS

export function validateCityNameField(cityName) {
  const namePattern = /^([a-zA-Z]{2,})/;
  if (!namePattern.test(cityName)) {
    return "City name should have at least 2 characters long.";
  }
  return null;
}

export function validateStreetNameField(streetName) {
  const namePattern =
    /^\d{0,4}\s?[a-zA-ZăîâșțĂÎÂȘȚ]{2,}(?:\s[a-zA-ZăîâșțĂÎÂȘȚ]+)*$/;
  if (!namePattern.test(streetName)) {
    return "Street name should have at least 2 characters long and only contain valid letters.";
  }
  return null;
}

export function validateStreetNumberField(streetNumber) {
  const namePattern = /^([0-9]+)/;
  if (!namePattern.test(streetNumber)) {
    return "This field is required. Numbers only accepted";
  }
  return null;
}

export function validateAreaField(area) {
  const namePattern = /^[1-9][0-9]*$/;
  if (!namePattern.test(area)) {
    return "This field is required. Numbers only accepted";
  }
  return null;
}

export function validateYearField(yearBuilt) {
  const date = new Date();
  const currentYear = date.getFullYear();
  const namePattern = /^\d{4}$/; // Numere de 4 cifre

  if (!namePattern.test(yearBuilt)) {
    return "Year must be a valid 4-digit number.";
  }
  if (yearBuilt > currentYear) {
    return `Year cannot be in the future (current year: ${currentYear}).`;
  }
  return null;
}

export function validateRentField(rent) {
  const namePattern = /^[1-9][0-9]*$/;
  if (!namePattern.test(rent)) {
    return "This field is required. Numbers only accepted";
  }
  return null;
}

export function validateDateAvailableField(dateAvailable) {
  const namePattern =
    /^(19|20)\d{2}[/-](0?[1-9]|1[0-2])[/-](0?[1-9]|[12][0-9]|3[01])$/;
  if (!namePattern.test(dateAvailable)) {
    return "Date is not in the format mm/dd/yyyy";
  }
  return null;
}

export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    let userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { ...userSnap.data(), uid }; // Datele utilizatorului
    } else {
      console.log("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, userData);
    return { success: true, data: userData };
  } catch (error) {
    console.error("Error updating user in Firestore:", error);
    return { success: false, error: error.message };
  }
};


export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const query = await getDocs(usersRef);
    return query.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const toggleAdmin = async (uid, isAdmin) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { isAdmin: !isAdmin });
  } catch (error) {
    console.error("Error updating users status:", error);
  }
};

export const deleteUser = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

export const getApartments = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const userDoc = await getDoc(docRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.flats;
    } else {
      console.log("User not found");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch apartments", error);
    return [];
  }
};

/**
 * Ascultă modificările în toate apartamentele din colecția `users` și le furnizează printr-un callback.
 * @param {function} onUpdate - Callback pentru actualizarea datelor în timp real.
 * @returns {function} - Funcție pentru dezabonarea de la listener.
 */

export const getAllApartments = (onUpdate) => {
  const unsubscribe = onSnapshot(
    collection(db, "users"),
    (snapshot) => {
      try {
        const allFlats = [];
        snapshot.forEach((doc) => {
          const userData = doc.data();
          if (Array.isArray(userData.flats)) {
            allFlats.push(...userData.flats);
          }
        });
        onUpdate(allFlats); // Transmite apartamentele actualizate prin callback
      } catch (err) {
        console.error("Error processing snapshot data:", err);
        onUpdate([], err); // Transmite eroarea prin callback
      }
    },
    (error) => {
      console.error("Error fetching apartments:", error);
      onUpdate([], error); // Transmite eroarea prin callback
    }
  );

  // Returnează funcția de dezabonare
  return unsubscribe;
};

// export const getFavouriteApartments = (userId, onUpdate) => {
//   const unsubscribe = onSnapshot(
//     collection(db, "users"),
//     (snapshot) => {
//       try {
//         const userFlats = []; // Array pentru apartamentele favorite ale utilizatorului specificat
//         snapshot.forEach((doc) => {
//           const userData = doc.data();
//           // Verifică dacă ID-ul documentului se potrivește cu userId
//           if (doc.id === userId && Array.isArray(userData.flats)) {
//             // Filtrează apartamentele favorite
//             const favouriteFlats = userData.flats.filter(
//               (flat) => flat.isFavourite
//             );
//             userFlats.push(...favouriteFlats); // Adaugă apartamentele favorite în userFlats
//           }
//         });
//         onUpdate(userFlats); // Transmite apartamentele favorite prin callback
//       } catch (err) {
//         console.error("Error processing snapshot data:", err);
//         onUpdate([], err); // Transmite eroarea prin callback
//       }
//     },
//     (error) => {
//       console.error("Error fetching apartments:", error);
//       onUpdate([], error); // Transmite eroarea prin callback
//     }
//   );

//   // Returnează funcția de dezabonare
//   return unsubscribe;
// };

export const filterUsersByCriteria = ({
  users,
  isAdmin,
  ageRange,
  flatsRange,
}) => {
  return users.filter((user) => {
    // Filtrare după isAdmin
    if (typeof isAdmin !== "undefined" && user.isAdmin !== isAdmin) {
      return false;
    }

    // Filtrare după interval de vârstă
    if (ageRange) {
      const birthYear = new Date(user.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      const userAge = currentYear - birthYear;

      if (
        (ageRange.min && userAge < ageRange.min) ||
        (ageRange.max && userAge > ageRange.max)
      ) {
        return false;
      }
    }

    // Filtrare după intervalul numărului de apartamente
    if (flatsRange) {
      const flatsCount = user.flats.length;
      if (
        (flatsRange.min && flatsCount < flatsRange.min) ||
        (flatsRange.max && flatsCount > flatsRange.max)
      ) {
        return false;
      }
    }

    return true;
  });
};

export const sortUsersByCriteria = ({ users, key, order = "asc" }) => {
  return [...users].sort((a, b) => {
    const isAscending = order === "asc";
    if (key === "firstName" || key === "lastName") {
      const valueA = a[key].toLowerCase();
      const valueB = b[key].toLowerCase();
      return isAscending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (key === "flatsCount") {
      const flatsA = a.flats.length;
      const flatsB = b.flats.length;
      return isAscending ? flatsA - flatsB : flatsB - flatsA;
    }

    return 0;
  });
};

export const useApartments = () => {
  const [state, dispatch] = useReducer(apartmentReducer, {
    apartments: [],
    isLoading: false,
    error: null,
    filtered: null,
    sorted: null,
  });

  const fetchAllApartments = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    const unsubscribe = getAllApartments((updatedApartments, error) => {
      if (error) dispatch({ type: "FETCH_ERROR", payload: error.message });
      else dispatch({ type: "FETCH_SUCCESS", payload: updatedApartments });
    });
    return unsubscribe;
  }, []);

  const fetchUserApartments = useCallback(async (userId) => {
    dispatch({ type: "FETCH_START" });
    try {
      const userQuery = query(
        collection(db, "users"),
        where("id", "==", userId)
      );
      const querySnapshot = await getDocs(userQuery);
      const userFlats = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userFlats.push(...userData.flats);
      });
      dispatch({ type: "FETCH_SUCCESS", payload: userFlats });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  }, []);

  const fetchFavouriteApartments = useCallback(async (userId) => {
    dispatch({ type: "FETCH_START" });
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        console.error("User not found");
        return;
      }
  
      const userData = userDoc.data();
      const favouriteFlats = userData.favourites || [];
      dispatch({ type: "FETCH_SUCCESS", payload: favouriteFlats });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  }, []);
  

  const setFilteredApartments = (filtered) => {
    dispatch({ type: "FETCH_FILTERED", payload: filtered });
  };

  const setSortedApartments = (sorted) => {
    dispatch({ type: "FETCH_SORTED", payload: sorted });
  };

  const setApartments = (updatedApartments) => {
    dispatch({ type: "SET_APARTMENTS", payload: updatedApartments });
  };

  return {
    apartments: state.apartments,
    isLoading: state.isLoading,
    error: state.error,
    filtered: state.filtered,
    sorted: state.sorted,
    fetchAllApartments,
    fetchUserApartments,
    fetchFavouriteApartments,
    setFilteredApartments,
    setSortedApartments,
    setApartments,
  };
};

export const useUsers = () => {
  const [state, dispatch] = useReducer(userReducer, {
    users: [],
    filteredUsers: [],
    isLoading: false,
    error: null,
  });

  const fetchUsers = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const allUsers = await getAllUsers(); // Preluăm utilizatorii
      dispatch({ type: "FETCH_USERS", payload: allUsers }); // Populăm starea
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  }, []);

  const filterUsers = (criteria) => {
    dispatch({ type: "FILTER_USERS", payload: criteria });
  };

  const sortUsers = (criteria) => {
    dispatch({ type: "SORT_USERS", payload: criteria });
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const resetSort = () => {
    dispatch({ type: "RESET_SORT" });
  };

  return {
    users: state.users,
    filteredUsers: state.filteredUsers,
    isLoading: state.isLoading,
    error: state.error,
    fetchUsers,
    filterUsers,
    sortUsers,
    resetFilters,
    resetSort,
  };
};

export const getOwnerData = async (flat) => {
  if (!flat.userId) {
    console.error("User ID is missing in flat object.");
    return null;
  }

  try {
    const userDoc = await getDoc(doc(db, "users", flat.userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error fetching owner data:", error);
    return null;
  }
};


export const calculateAge = (birthDate) => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);

  let age = today.getFullYear() - birthDateObj.getFullYear();

  // Ajustăm vârsta dacă ziua curentă este înainte de ziua de naștere.
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birthDateObj.getMonth() ||
    (today.getMonth() === birthDateObj.getMonth() &&
      today.getDate() < birthDateObj.getDate());

  if (hasNotHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp); // Crează un obiect Date din timestamp
  // Extrage componentele datei
  const day = String(date.getDate()).padStart(2, '0'); // Ziua (zz)
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Luna (ll) - +1 pentru că lunile sunt indexate de la 0
  const year = date.getFullYear(); // Anul (aaaa)
  // Extrage componentele timpului
  const hours = String(date.getHours()).padStart(2, '0'); // Orele (hh)
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutele (mm)
  const seconds = String(date.getSeconds()).padStart(2, '0'); // Secundele (ss)
  // Formatează data și ora
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}