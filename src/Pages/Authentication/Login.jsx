import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getUserData } from "../../utilFunctions.jsx";
import auth from "../../firebase.js";
import useAuth from "../../Contexts/UseAuth.js";
import styles from "./Login.module.css";
import "./authentication.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredential.user;
      const userData = await getUserData(uid);

      if (userData) {
        console.log("Logging in user:", userData); // Debug
        login(userData);
      } else {
        console.error("Failed to fetch user data.");
      }
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed");
    }
  };

  return (
    <div className="topnav-user">
      <div className={styles["form-frame"]}>
        <form className={styles["login-form"]} onSubmit={handleSubmit}>
          <h1>Login Form</h1>
          <input
            type="text"
            value={email}
            placeholder="name@provider.com"
            className="input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <h6>
            Forgot Password? Click <Link to="/forgotten-password">HERE</Link>
          </h6>
          <button type="submit" className="submit-button">
            LOGIN
          </button>
        </form>
        <h5 className={styles.member}>Not a member? Please Register!</h5>
        <Link to="/register" className="register-link">
          <button type="button" className="register">
            REGISTRATION
          </button>
        </Link>
      </div>
    </div>
  );
};

export const ButtonLogin = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={styles["login-btn"]}
      onClick={() => {
        navigate("/login");
      }}
    >
      Authenticate
    </button>
  );
};

export default Login;
