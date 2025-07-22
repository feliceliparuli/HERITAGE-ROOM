import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";

function Bookings() {
  const { email, role, status } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = () => {
    const endpoint = role === "ADMIN" ? "/api/bookings" : "/api/bookings/me";

    fetch(endpoint, {
      headers: {
        Authorization: "Basic " + localStorage.getItem("auth"),
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Impossibile caricare le prenotazioni");
        return res.json();
      })
      .then(setBookings)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    if (status !== "succeeded" || !email) return;
    fetchBookings();
  }, [role, status, email]);

  const handleDelete = (id) => {
    if (!window.confirm("Confermi la cancellazione della prenotazione?"))
      return;

    fetch(`/api/bookings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Basic " + localStorage.getItem("auth"),
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante l'eliminazione");
        fetchBookings();
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>
          {role === "ADMIN" ? "Tutte le Prenotazioni" : "Le Mie Prenotazioni"}
        </h2>
        <Button as={Link} to="/bookings/new" variant="primary">
          Nuova Prenotazione
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Room</th>
            <th>Customer</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Totale</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.room?.name || "—"}</td>
              <td>{b.customer?.name || "—"}</td>
              <td>{b.checkIn || "—"}</td>
              <td>{b.checkOut || "—"}</td>
              <td>
                {b.room?.pricePerNight && b.nights
                  ? `${(b.room.pricePerNight * b.nights).toFixed(2)} €`
                  : "—"}
              </td>
              <td>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  as={Link}
                  to={`/bookings/edit/${b.id}`}
                >
                  Modifica
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(b.id)}
                >
                  Cancella
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Bookings;
