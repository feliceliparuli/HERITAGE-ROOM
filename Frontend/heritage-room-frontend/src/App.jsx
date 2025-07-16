import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Clients from "./pages/Clients";
import useAuth from "./hooks/useAuth";

function App() {
  const { isAuthenticated, role } = useAuth();

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
