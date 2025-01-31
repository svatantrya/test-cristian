/* eslint-disable react/prop-types */
import styles from "./Navbar.module.css";
import "../../index.css";
import Menu from "../Menu/Menu";
import { ButtonLogin } from "../../Pages/Authentication/Login";
import Countdown from "../Countdown/Countdown";

const Navbar = ({ user, onLogout }) => {
  const isLoggedIn = user && user.firstName;

  return (
    <nav className="topnav">
      <div className={styles["logged-user"]}>
        <h4>{isLoggedIn ? `Welcome ${user.firstName}` : <ButtonLogin />}</h4>
        {isLoggedIn && <Countdown />}
        {isLoggedIn && (
          <button
            className={styles["logout-btn"]}
            type="submit"
            onClick={onLogout}
          >
            Logout
          </button>
        )}
      </div>

      <div className={styles.navbar}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/flatease-79932.firebasestorage.app/o/background%2FLogo1.png?alt=media&token=2d714ab7-85f2-469f-9e15-64790ee2ef1d"
          className={styles.logo}
          alt="Logo picture"
        />
        <Menu />
      </div>
    </nav>
  );
};

export default Navbar;
