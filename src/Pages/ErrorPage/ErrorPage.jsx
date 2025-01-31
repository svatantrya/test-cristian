import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className={styles["not-found-container"]}>
      <h1 className={styles.texth1}>404</h1>
      <h2 className={styles.texth2}>Oops! The page has not been found.</h2>
      <p className={styles.text}>
        We are sorry, but the page you are looking for does not exist. It was
        either probably deleted or either never created.
      </p>
      <button className={styles.btn} onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default ErrorPage;
