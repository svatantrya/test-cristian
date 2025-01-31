import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  validateFirstNameField,
  validateLastNameField,
  validateEmailField,
  validatePasswordField,
  validateSamePasswordField,
  validateBirthDateField,
  updateUser,
  testIfRegistered,
  getUserData,
} from "../../utilFunctions";
import registerUser from "../../Components/RegisterUser";
import ValidateForm from "./UserValidation";
import "./authentication.css";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obține uid din URL
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    samePassword: "",
    birthDate: "",
    isAdmin: false,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    samePassword: "",
    birthDate: "",
  });
  const [isNewUser, setIsNewUser] = useState(!id);
  const [fieldDisabled, setFieldDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return; // Dacă nu există id, nu căutăm date
      setLoading(true);
      try {
        const userData = await getUserData(id);
        if (userData) {
          setUser({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            birthDate: userData.birthDate,
            password: "",
            samePassword: "",
          });
          setIsNewUser(false);
          setFieldDisabled(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    let errorField = null;
    switch (name) {
      case "firstName":
        errorField = validateFirstNameField(value);
        break;
      case "lastName":
        errorField = validateLastNameField(value);
        break;
      case "email":
        errorField = validateEmailField(value);
        break;
      case "password":
        errorField = validatePasswordField(value);
        break;
      case "samePassword":
        errorField = validateSamePasswordField(user.password, value);
        break;
      case "birthDate":
        errorField = validateBirthDateField(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorField }));
  };

  const handleRegister = async () => {
    if (isNewUser) {
      // Dacă este un utilizator nou
      const emailExists = await testIfRegistered(user.email);
      if (emailExists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "User already registered.",
        }));
        return;
      }
      
      const userData = {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        isAdmin: user.isAdmin,
      };
     
      const result = await registerUser(userData);
      if (result.success) {
        console.log("User registered successfully");
        navigate("/login");
      } else {
        console.error("Registration failed:", result.error);
        alert(`Error: ${result.error}`);
      }
    } else {
      try {
        const updatedData = {
          firstName: user.firstName,
          lastName: user.lastName,
          birthDate: user.birthDate,
        };
  
        // Actualizare date în Firestore
        const result = await updateUser(id, updatedData);
        if (result.success) {
          console.log("User updated successfully in Firestore:", result.data);
          navigate(-1);
        } else {
          console.error("Update failed in Firestore:", result.error);
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error during user update:", error.message);
        alert("An error occurred while updating the user. Please try again.");
      }
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    const isValid = ValidateForm(isNewUser, user, validationErrors);

    if (!isValid) {
      setErrors(validationErrors);
      alert("Please fill out the red marked field(s)");
      return;
    }

    setLoading(true);
    await handleRegister();
    setLoading(false);
    setUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      samePassword: "",
      birthDate: "",
    });
  };

  if (loading) {
    return (
      <div className="spinnerContainer">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="topnav-user">
      <div className={styles["form-frame"]}>
        <form className={styles["login-form"]} onSubmit={handleSubmit}>
          {isNewUser ? <h1>Registration Form</h1> : <h1>Edit Form</h1>}
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            className="input"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <div className="error">{errors.firstName}</div>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            className="input"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
          <div className="error">{errors.lastName}</div>
          <input
            type="text"
            name="email"
            value={user.email}
            className="input"
            placeholder="name@provider.com"
            onChange={handleChange}
            disabled = {fieldDisabled}
          />
          <div className="error">{errors.email}</div>
          {isNewUser && (
            <>
              <input
                type="password"
                name="password"
                value={user.password}
                className="input"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <div className="error">{errors.password}</div>
              <input
                type="password"
                name="samePassword"
                value={user.samePassword}
                className="input"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
              />
              <div className="error">{errors.samePassword}</div>
            </>
          )}
          <div className={styles["date-of-birth"]}>
            <label htmlFor="birth-date">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={user.birthDate}
              id="birth-date"
              onChange={handleChange}
              required
            />
          </div>
          <div className="error">{errors.birthDate}</div>
          <button type="submit" className="submit-form">
            SUBMIT
          </button>
        </form>
        {isNewUser && (
          <>
            <h5 className={styles.h5}>Already a member? Please Login!</h5>
            <Link to={"/login"} className="register-link">
              <button type="button" className="register">
                LOGIN
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
