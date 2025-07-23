import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { useSelector } from "react-redux";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    roomId: "",
    customerId: "",
    checkIn: "",
    checkOut: "",
  });

  const { email, role } = useSelector((state) => state.user);
  const today = new Date().toISOString().split("T")[0];

  const fetchBookings = () => {
    fetch("/api/bookings", {
      headers: { Authorization: "Basic " + localStorage.getItem("auth") },
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setBookings)
      .catch(() =>
        setError("Errore durante il caricamento delle prenotazioni.")
      );
  };

  const fetchCustomers = () => {
    if (role === "ADMIN") {
      fetch("/api/customers", {
        headers: { Authorization: "Basic " + localStorage.getItem("auth") },
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setCustomers)
        .catch(() => setCustomers([]));
    } else {
      fetch(`/api/customers/email/${email}`, {
        headers: { Authorization: "Basic " + localStorage.getItem("auth") },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setCustomers([data]);
          setFormData((prev) => ({ ...prev, customerId: data.id }));
        })
        .catch(() => setCustomers([]));
    }
  };

  const fetchAvailableRooms = () => {
    const { checkIn, checkOut } = formData;
    if (!checkIn || !checkOut) return;

    fetch(`/api/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`, {
      headers: { Authorization: "Basic " + localStorage.getItem("auth") },
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setRooms)
      .catch(() => setRooms([]));
  };

  useEffect(() => {
    fetchBookings();
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchAvailableRooms();
  }, [formData.checkIn, formData.checkOut, editingBooking]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOpenModal = (booking = null) => {
    if (booking) {
      setEditingBooking(booking);
      setFormData({
        roomId: booking.room.id,
        customerId: booking.customer.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      });
    } else {
      setEditingBooking(null);
      setFormData({
        roomId: "",
        customerId: "",
        checkIn: "",
        checkOut: "",
      });
    }
    setShowModal(true);
    setError(null);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingBooking(null);
    setFormData({
      roomId: "",
      customerId: "",
      checkIn: "",
      checkOut: "",
    });
    setRooms([]);
    setError(null);
  };

  const confirmDelete = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!bookingToDelete) return;

    fetch(`/api/bookings/${bookingToDelete.id}`, {
      method: "DELETE",
      headers: { Authorization: "Basic " + localStorage.getItem("auth") },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        fetchBookings();
        setShowDeleteModal(false);
        setBookingToDelete(null);
      })
      .catch(() => setError("Errore durante l'eliminazione."));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingBooking ? "PUT" : "POST";
    const url = editingBooking
      ? `/api/bookings/${editingBooking.id}`
      : "/api/bookings";

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
                : "Errore durante il salvataggio."
            );
          });
        }
        return res.json();
      })
      .then(() => {
        fetchBookings();
        handleClose();
      })
      .catch((err) => setError(err.message));
  };

  const calculateTotal = () => {
    const inDate = new Date(formData.checkIn);
    const outDate = new Date(formData.checkOut);
    const nights = (outDate - inDate) / (1000 * 60 * 60 * 24);

    const room =
      rooms.find((r) => r.id === parseInt(formData.roomId)) ||
      bookings.find((b) => b.id === editingBooking?.id)?.room;

    return room && nights > 0 ? nights * room.pricePerNight : 0;
  };

  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h2>Prenotazioni</h2>
        </Col>
        <Col className="text-end">
          <Button onClick={() => handleOpenModal()}>Nuova Prenotazione</Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Stanza</th>
            <th>Cliente</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Notti</th>
            <th>Prezzo Totale</th>
            <th>Creata il</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.room?.name}</td>
              <td>{b.customer?.name}</td>
              <td>{new Date(b.checkIn).toLocaleDateString("it-IT")}</td>
              <td>{new Date(b.checkOut).toLocaleDateString("it-IT")}</td>
              <td>{b.nights}</td>
              <td>
                {typeof b.totalPrice === "number"
                  ? `€${b.totalPrice.toFixed(2)}`
                  : "—"}
              </td>
              <td>
                {b.createdAt
                  ? new Date(b.createdAt).toLocaleDateString("it-IT") +
                    " " +
                    new Date(b.createdAt).toLocaleTimeString("it-IT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </td>
              <td>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleOpenModal(b)}
                >
                  Modifica
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => confirmDelete(b)}
                >
                  Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal creazione/modifica */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingBooking ? "Modifica Prenotazione" : "Nuova Prenotazione"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                  disabled={!!editingBooking}
                >
                  <option value="">Seleziona una stanza</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} (€{room.pricePerNight}/notte)
                    </option>
                  ))}
                </Form.Select>
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
                  disabled={!!editingBooking}
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

      {/* Modal conferma eliminazione */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Conferma eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sei sicuro di voler eliminare questa prenotazione?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annulla
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Bookings;
