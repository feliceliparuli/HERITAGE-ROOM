import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  const { getAuthHeader, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return; // non caricare se non autenticato

    fetch("http://localhost:8080/api/bookings", {
      headers: {
        ...getAuthHeader(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore HTTP: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore durante il caricamento delle prenotazioni:", err);
        setErrore("Errore durante il caricamento delle prenotazioni");
        setLoading(false);
      });
  }, [isAuthenticated]); // ricarica quando fa login

  if (!isAuthenticated)
    return <p>Effettua il login per vedere le prenotazioni.</p>;
  if (loading) return <p>Caricamento prenotazioni...</p>;
  if (errore) return <p>{errore}</p>;

  return (
    <div>
      <h2>Prenotazioni</h2>
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            Cliente: {b.customer?.name} | Stanza: {b.room?.name} | {b.checkIn} ➔{" "}
            {b.checkOut}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bookings;
