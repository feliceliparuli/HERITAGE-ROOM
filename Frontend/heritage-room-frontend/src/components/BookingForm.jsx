import { useEffect, useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function BookingForm() {
  const { role, id: userId } = useSelector((state) => state.user);

  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    roomId: "",
    startDate: "",
    endDate: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Carica stanze e clienti (se ADMIN)
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const headers = {
      Authorization: `Basic ${auth}`,
    };

    fetch("http://localhost:8080/api/rooms", {
      headers,
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setRooms)
      .catch(() => setError("Errore nel caricamento stanze"));

    if (role === "ADMIN") {
      fetch("http://localhost:8080/api/customers", {
        headers,
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setCustomers)
        .catch(() => setError("Errore nel caricamento clienti"));
    }
  }, [role]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const auth = localStorage.getItem("auth");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    };

    const bookingData = {
      ...formData,
      customerId: role === "USER" ? userId : formData.customerId,
    };

    fetch("http://localhost:8080/api/bookings", {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(bookingData),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore nella creazione della prenotazione");
        setSuccess(true);
        setFormData({
          customerId: "",
          roomId: "",
          startDate: "",
          endDate: "",
        });
      })
      .catch((err) => setError(err.message));
  };

  return (
    <Container className="mt-4">
      <h2>Nuova Prenotazione</h2>

      {success && (
        <Alert variant="success">Prenotazione creata con successo!</Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        {role === "ADMIN" && (
          <Form.Group className="mb-3">
            <Form.Label>Cliente</Form.Label>
            <Form.Select
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona cliente</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Stanza</Form.Label>
          <Form.Select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
          >
            <option value="">Seleziona stanza</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.type})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Data inizio</Form.Label>
          <Form.Control
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Data fine</Form.Label>
          <Form.Control
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" className="mt-2">
          Salva prenotazione
        </Button>
      </Form>
    </Container>
  );
}
