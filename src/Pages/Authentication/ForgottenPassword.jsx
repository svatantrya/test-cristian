import { useNavigate } from "react-router-dom";

const ForgottenPassword = () => {
  const navigate = useNavigate();
  alert("Your account will be deleted");
  navigate("/register");
};

export default ForgottenPassword;
