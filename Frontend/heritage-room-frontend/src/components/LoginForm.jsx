import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/userSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isFromPrenota =
    new URLSearchParams(location.search).get("from") === "prenota";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const credentials = btoa(`${email}:${password}`);
    const authHeader = `Basic ${credentials}`;

    fetch("/api/auth/me", {
      method: "GET",
      headers: { Authorization: authHeader },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Login fallito. Verifica email e password.");
        }
        return res.json();
      })
      .then((userData) => {
        if (!userData.email || !userData.role) {
          throw new Error("Risposta non valida dal server.");
        }

        dispatch(loginSuccess(userData));
        localStorage.setItem("auth", credentials);

        //  Se arrivi da Prenota vai su /bookings, altrimenti su /
        navigate(isFromPrenota ? "/bookings" : "/", { replace: true });
      })
      .catch((err) => {
        console.error("Errore login:", err);
        setError(err.message || "Errore imprevisto.");
      });
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary">Accedi</button>

        {/* Link per creare account */}
        {isFromPrenota && (
          <div className="mt-3">
            <span>Non sei registrato? </span>
            <Link to="/registrati?from=prenota">Crea un account</Link>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
