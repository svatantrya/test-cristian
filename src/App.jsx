import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.jsx";
import useAuth from "./Contexts/UseAuth.js";

function App() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const hideNavbar =
    ["/login", "/register", "/forgotten-password"].includes(
      location.pathname
    ) || location.pathname.startsWith("/edit-user");

  return (
    <>
      {!hideNavbar && <Navbar user={user} onLogout={logout} />}
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default App;
