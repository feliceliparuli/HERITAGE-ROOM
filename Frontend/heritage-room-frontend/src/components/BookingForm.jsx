import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

function BookingForm() {
  const [roomId, setRoomId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { email, role } = useSelector((state) => state.user);

  // Carica stanze
  useEffect(() => {
    fetch("http://localhost:8080/api/rooms")
      .then((res) => res.json())
      .then(setRooms)
      .catch(() => setRooms([]));
  }, []);

  // Carica clienti: tutti se ADMIN, solo sé stesso se USER
  useEffect(() => {
    const auth = {
      headers: {
        Authorization: "Basic " + localStorage.getItem("auth"),
      },
      credentials: "include",
    };

    if (role === "ADMIN") {
      fetch("http://localhost:8080/api/customers", auth)
        .then((res) => res.json())
        .then(setCustomers)
        .catch(() => setCustomers([]));
    } else {
      fetch("http://localhost:8080/api/customers/email/" + email, auth)
        .then((res) => res.json())
        .then((data) => {
          setCustomers([data]);
          setCustomerId(data.id);
        })
        .catch(() => setCustomers([]));
    }
  }, [email, role]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const booking = {
      room: { id: parseInt(roomId) },
      customer: { id: parseInt(customerId) },
      checkIn,
      checkOut,
    };

    fetch("http://localhost:8080/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + localStorage.getItem("auth"),
      },
      credentials: "include",
      body: JSON.stringify(booking),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nella creazione");
        return res.json();
      })
      .then(() => {
        setSuccess(true);
        setTimeout(() => navigate("/bookings"), 1500);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="container mt-4">
      <h2>Nuova Prenotazione</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">Prenotazione creata con successo!</Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Room */}
        <Form.Group className="mb-3">
          <Form.Label>Stanza</Form.Label>
          <Form.Select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          >
            <option value="">Seleziona una stanza</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} (€{room.pricePerNight}/notte)
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Customer */}
        <Form.Group className="mb-3">
          <Form.Label>Cliente</Form.Label>
          {role === "ADMIN" ? (
            <Form.Select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
            >
              <option value="">Seleziona un cliente</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.email})
                </option>
              ))}
            </Form.Select>
          ) : (
            <Form.Control
              type="text"
              value={customers[0]?.fullName || email}
              disabled
            />
          )}
        </Form.Group>

        {/* Check-in */}
        <Form.Group className="mb-3">
          <Form.Label>Check-In</Form.Label>
          <Form.Control
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </Form.Group>

        {/* Check-out */}
        <Form.Group className="mb-3">
          <Form.Label>Check-Out</Form.Label>
          <Form.Control
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Crea Prenotazione
        </Button>
      </Form>
    </div>
  );
}

export default BookingForm;
