import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Clients from "./pages/Clients";
import LoginForm from "./components/LoginForm";
import Home from "./pages/Home";
import Contatti from "./pages/Contatti";
import Registrati from "./pages/Registrati";
import { loadUserFromStorage } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
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
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar />

      <main className="container my-4 flex-grow-1">
        <Routes>
          {/* Pagine pubbliche */}
          <Route path="/" element={<Home />} />
          <Route path="/contacts" element={<Contatti />} />
          <Route
            path="/registrati"
            element={
              isAuthenticated ? (
                <Navigate to="/bookings" replace />
              ) : (
                <Registrati />
              )
            }
          />

          {/* Pagine protette */}
          <Route
            path="/rooms"
            element={
              isAuthenticated && role === "ADMIN" ? (
                <Rooms />
              ) : status === "loading" ? (
                <div>Caricamento...</div>
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
              ) : status === "loading" ? (
                <div>Caricamento...</div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/bookings"
            element={
              isAuthenticated ? (
                <Bookings />
              ) : status === "loading" ||
                location.search.includes("from=prenota") ? (
                <div>Caricamento...</div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
