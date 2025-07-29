import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import BookingsTable from "../components/BookingsTable";
import BookingsModal from "../components/BookingsModal";
import BookingsDelete from "../components/BookingsDelete";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [monthFilter, setMonthFilter] = useState("");

  const fetchBookings = () => {
    fetch("/api/bookings", {
      headers: { Authorization: "Basic " + localStorage.getItem("auth") },
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setBookings)
      .catch((err) => console.error("Errore nel fetch bookings:", err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenNew = () => {
    setSelectedBooking(null);
    setShowModal(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedBooking) return;
    fetch(`/api/bookings/${selectedBooking.id}`, {
      method: "DELETE",
      headers: { Authorization: "Basic " + localStorage.getItem("auth") },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          fetchBookings();
          setShowDeleteModal(false);
        } else {
          throw new Error("Errore eliminazione");
        }
      })
      .catch((err) => console.error("Errore delete:", err));
  };

  const filteredBookings = bookings.filter((b) => {
    if (!monthFilter) return true;
    const date = new Date(b.checkIn);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}` === monthFilter;
  });

  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h2>Prenotazioni</h2>
        </Col>
        <Col className="text-end">
          <Button onClick={handleOpenNew}>Nuova Prenotazione</Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Label>Filtra per mese (check-in):</Form.Label>
          <Form.Control
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          />
        </Col>
        <Col md="auto" className="d-flex align-items-end">
          <Button
            variant="outline-secondary"
            onClick={() => setMonthFilter("")}
          >
            Mostra tutte
          </Button>
        </Col>
      </Row>

      <BookingsTable
        bookings={filteredBookings}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <BookingsModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          fetchBookings();
        }}
        booking={selectedBooking}
      />

      <BookingsDelete
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        booking={selectedBooking}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
}
