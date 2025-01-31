import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../Contexts/UseAuth";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import styles from "./Menu.module.css";

const Menu = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isHamburgerVisible, setIsHamburgerVisible] = useState(false);
  const breakpoint = 991;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < breakpoint) {
        setIsMenuVisible(false);
        setIsHamburgerVisible(true);
      } else {
        setIsMenuVisible(true);
        setIsHamburgerVisible(false);
      }
    };

    handleResize(); //Verifica dimensiunea paginii la incarcare
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  const closeMenu = () => {
    if(isHamburgerVisible)
      setIsMenuVisible(false);
  };

  return (
    <div className={styles.container}>
      {isMenuVisible && (
        <ul
          className={`${styles.menu} ${
            isMenuVisible ? styles["menu-visible"] : ""
          }`}
        >
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.base} ${isActive ? styles.active : ""}`
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <NavLink
                  to="/my-flats"
                  className={({ isActive }) =>
                    `${styles.base} ${isActive ? styles.active : ""}`
                  }
                  onClick={closeMenu}
                >
                  My Flats
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/my-favourites"
                  className={({ isActive }) =>
                    `${styles.base} ${isActive ? styles.active : ""}`
                  }
                  onClick={closeMenu}
                >
                  My Favourites
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/my-profile"
                  className={({ isActive }) =>
                    `${styles.base} ${isActive ? styles.active : ""}`
                  }
                  onClick={closeMenu}
                >
                  My Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/delete-account"
                  className={({ isActive }) =>
                    `${styles.base} ${isActive ? styles.active : ""}`
                  }
                  onClick={closeMenu}
                >
                  Delete Account
                </NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink
                    to="/all-users"
                    className={({ isActive }) =>
                      `${styles.base} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeMenu}
                  >
                    All Users
                  </NavLink>
                </li>
              )}
            </>
          )}
        </ul>
      )}
      {isHamburgerVisible && (
        <button className={styles["menu-button"]} onClick={toggleMenu}>
          {isMenuVisible ? <IoClose /> : <GiHamburgerMenu />}
        </button>
      )}
    </div>
  );
};

export default Menu;
