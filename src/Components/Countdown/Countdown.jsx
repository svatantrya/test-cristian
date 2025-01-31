import { useState, useEffect } from "react";
import useAuth from "../../Contexts/UseAuth";
import styles from "./Countdown.module.css";

const Countdown = () => {
  const [time, setTime] = useState(null);
    const { logout } = useAuth();
    
  useEffect(() => {
    setTime(JSON.parse(localStorage.getItem("COUNTDOWN_KEY")) || 3600000);
  }, []);
    
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          localStorage.removeItem("COUNTDOWN_KEY");
          logout();
          return 0;
        }
        localStorage.setItem("COUNTDOWN_KEY", JSON.stringify(prevTime - 1000));
        return prevTime - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [logout]);
  const hours = Math.floor(time / 3600000) % 24;
  const minutes = Math.floor(time / 60000) % 60;
  const seconds = Math.floor(time / 1000) % 60;

  return (
    <div>
      <p className={styles["digit-format"]}>
        {String(hours).padStart(2, "0")} : {String(minutes).padStart(2, "0")} :{" "}
        {String(seconds).padStart(2, "0")}
      </p>
    </div>
  );
};

export default Countdown;
