import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Home from "./Pages/HomePage/Home";
import MyFlats from "./Pages/MyFlatsPage/MyFlats";
import MyFavourites from "./Pages/MyFavouritesPage/MyFavourites";
import AddFlat from "./Pages/AddFlat/AddFlat";
import AllUsers from "./Pages/AllUsers/AllUsers.jsx";
import Login from "./Pages/Authentication/Login.jsx";
import Register from "./Pages/Authentication/Register.jsx";
import ForgottenPassword from "./Pages/Authentication/ForgottenPassword.jsx";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import FlatView from "./Components/FlatView/FlatView.jsx";
import MyProfile from "./Pages/MyProfile/MyProfile.jsx";
import DeleteAccount from "./Pages/DeleteAccount/DeleteAccount.jsx";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./Contexts/AuthContext.jsx";
import { FavouriteProvider } from "./Contexts/FavouriteContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "my-flats",
        element: (
          <ProtectedRoute>
            <MyFlats />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-favourites",
        element: (
          <ProtectedRoute>
            <MyFavourites />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-flat",
        element: (
          <ProtectedRoute>
            <AddFlat />
          </ProtectedRoute>
        ),
      },
      {
        path: "all-users",
        element: (
          <ProtectedRoute>
            <AllUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "flat/:id",
        element: (
          <ProtectedRoute>
            <FlatView />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-user/:id",
        element: (
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-profile",
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "delete-account",
        element: (
          <ProtectedRoute>
            <DeleteAccount />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgotten-password", element: <ForgottenPassword /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FavouriteProvider>
        <RouterProvider router={router} />
      </FavouriteProvider>
    </AuthProvider>
  </StrictMode>
);
