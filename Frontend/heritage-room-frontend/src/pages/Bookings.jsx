import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

function Bookings() {
  const { roles } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    const endpoint = roles.includes("ROLE_ADMIN")
      ? "http://localhost:8080/api/bookings"
      : "http://localhost:8080/api/bookings/my";

    fetch(endpoint, { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error("Errore HTTP: " + response.status);
        return response.json();
      })
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore:", err);
        setErrore("Errore nel caricamento delle prenotazioni");
        setLoading(false);
      });
  }, [roles]);

  if (loading) return <p>Caricamento...</p>;
  if (errore) return <p>{errore}</p>;

  return (
    <div>
      <h2>Prenotazioni</h2>
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            {b.customer?.name} – {b.room?.name} – {b.checkIn} → {b.checkOut}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bookings;
