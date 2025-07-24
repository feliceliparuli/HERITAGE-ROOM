import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function BookingsModal({ show, onHide, booking }) {
  const { email, role } = useSelector((state) => state.user);
  const today = new Date().toISOString().split("T")[0];

  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    roomId: "",
    customerId: "",
    checkIn: "",
    checkOut: "",
  });

  // 1. Carica clienti
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(
          role === "ADMIN" ? "/api/customers" : `/api/customers/email/${email}`,
          {
            headers: { Authorization: "Basic " + localStorage.getItem("auth") },
            credentials: "include",
          }
        );
        const data = await res.json();
        const customerList = role === "ADMIN" ? data : [data];
        setCustomers(customerList);
      } catch {
        setCustomers([]);
      }
    };
    fetchCustomers();
  }, [email, role]);

  // 2. Inizializza formData al cambio clienti o prenotazione
  useEffect(() => {
    if (booking) {
      setFormData({
        roomId: booking.room.id,
        customerId: booking.customer.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      });
    } else if (customers.length > 0) {
      const userId = customers[0]?.id || "";
      setFormData({
        roomId: "",
        customerId: role === "USER" ? userId : "",
        checkIn: "",
        checkOut: "",
      });
    }
    setError(null);
  }, [booking, customers]);

  useEffect(() => {
    const shouldFetch =
      show &&
      formData.checkIn &&
      formData.checkOut &&
      (!booking || formData.roomId === "");

    if (!shouldFetch) return;

    let url = `/api/rooms/available?checkIn=${formData.checkIn}&checkOut=${formData.checkOut}`;
    if (booking?.id) {
      url += `&excludeBookingId=${booking.id}`;
    }

    fetch(url, {
      headers: { Authorization: "Basic " + localStorage.getItem("auth") },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
      })
      .catch(() => {
        setRooms([]);
      });
  }, [formData, show, booking]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = booking ? "PUT" : "POST";
    const url = booking ? `/api/bookings/${booking.id}` : "/api/bookings";

    const payload = {
      room: { id: parseInt(formData.roomId) },
      customer: { id: parseInt(formData.customerId) },
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
    };

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + localStorage.getItem("auth"),
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(
              text.includes("non disponibile")
                ? "La stanza è già prenotata per quelle date."
                : "La stanza è già prenotata per quelle date."
            );
          });
        }
        return res.json();
      })
      .then(() => {
        onHide();
      })
      .catch((err) => setError(err.message));
  };

  const calculateTotal = () => {
    const inDate = new Date(formData.checkIn);
    const outDate = new Date(formData.checkOut);
    const nights = (outDate - inDate) / (1000 * 60 * 60 * 24);
    const room =
      rooms.find((r) => r.id === parseInt(formData.roomId)) || booking?.room;
    return room && nights > 0 ? nights * room.pricePerNight : 0;
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {booking ? "Modifica Prenotazione" : "Nuova Prenotazione"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Check-In</Form.Label>
            <Form.Control
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              min={today}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Check-Out</Form.Label>
            <Form.Control
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              min={formData.checkIn || today}
              required
            />
          </Form.Group>

          {formData.checkIn && formData.checkOut && (
            <Form.Group className="mb-3">
              <Form.Label>Stanza</Form.Label>
              <Form.Select
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                required
                disabled={!!booking}
              >
                <option value="">Seleziona una stanza</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} (€{room.pricePerNight}/notte)
                  </option>
                ))}
              </Form.Select>
              {rooms.length === 0 && !booking && (
                <div className="text-muted mt-1">
                  Nessuna stanza disponibile per queste date.
                </div>
              )}
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Cliente</Form.Label>
            {role === "ADMIN" ? (
              <Form.Select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
                disabled={!!booking}
              >
                <option value="">Seleziona un cliente</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            ) : (
              <Form.Control
                type="text"
                value={customers[0]?.name || email}
                disabled
              />
            )}
          </Form.Group>

          {formData.roomId && formData.checkIn && formData.checkOut && (
            <div className="mb-3">
              <strong>Totale stimato: €{calculateTotal().toFixed(2)}</strong>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={!formData.roomId || !formData.customerId}
          >
            Salva
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
