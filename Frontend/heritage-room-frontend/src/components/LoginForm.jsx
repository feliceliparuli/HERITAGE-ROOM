import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = btoa(`${email}:${password}`);
    const authHeader = `Basic ${credentials}`;

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: authHeader,
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Login fallito. Verifica email e password.");
      }

      const userData = await res.json();
      if (!userData.email || !userData.role) {
        throw new Error("Risposta non valida dal server.");
      }

      dispatch(loginSuccess(userData));
      localStorage.setItem("auth", credentials);
      setError(null);
      navigate("/");
    } catch (err) {
      console.error("Errore login:", err);
      setError(err.message || "Errore imprevisto.");
    }
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
      </form>
    </div>
  );
}

export default LoginForm;
