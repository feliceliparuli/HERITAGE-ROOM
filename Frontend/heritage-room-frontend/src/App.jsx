import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import NavigationBar from "./components/NavigationBar";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Clients from "./pages/Clients";
import LoginForm from "./components/LoginForm";

import { loadUserFromStorage } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();
  const { email, role, status } = useSelector((state) => state.user);
  const isAuthenticated = !!email;

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <NavigationBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h2>Benvenuto in Heritage Room</h2>} />

          <Route
            path="/rooms"
            element={
              isAuthenticated && role === "ADMIN" ? (
                <Rooms />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/clients"
            element={
              isAuthenticated && role === "ADMIN" ? (
                <Clients />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/bookings"
            element={
              isAuthenticated ? <Bookings /> : <Navigate to="/" replace />
            }
          />

          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
