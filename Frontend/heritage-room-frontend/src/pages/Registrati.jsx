import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/userSlice";
import { useNavigate, useLocation } from "react-router-dom";

function Registrati() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica se arrivi da Prenota
  const isFromPrenota =
    new URLSearchParams(location.search).get("from") === "prenota";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const { name, email, phone, password } = form;
    const authHeader = "Basic " + btoa(`${email}:${password}`);

    // Controllo veloce lato client se esiste già l'email
    fetch(`/api/customers/email/${email}`)
      .then((checkRes) => {
        if (checkRes.ok) {
          throw new Error("Questa email è già registrata.");
        }

        // Procedi con la registrazione
        return fetch("/api/customers/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, phone, password }),
        });
      })
      .then((registerRes) => {
        if (registerRes.status === 409) {
          throw new Error("Questa email è già registrata.");
        }
        if (!registerRes.ok) {
          throw new Error("Registrazione fallita.");
        }

        // Dopo registrazione, login automatico
        return fetch("/api/auth/me", {
          headers: { Authorization: authHeader },
          credentials: "include",
        });
      })
      .then((loginRes) => {
        if (!loginRes.ok) {
          throw new Error("Login fallito dopo la registrazione.");
        }
        return loginRes.json();
      })
      .then((user) => {
        dispatch(loginSuccess(user));
        localStorage.setItem("auth", btoa(`${email}:${password}`));

        //  Se arrivi da Prenota vai su /bookings, altrimenti su /
        navigate(isFromPrenota ? "/bookings" : "/", { replace: true });
      })
      .catch((err) => {
        setError(err.message || "Errore durante la registrazione.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Registrati</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nome</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Telefono</label>
          <input
            className="form-control"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary">Registrati</button>
      </form>
    </div>
  );
}

export default Registrati;
