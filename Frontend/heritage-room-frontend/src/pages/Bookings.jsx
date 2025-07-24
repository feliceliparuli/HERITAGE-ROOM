import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import BookingsTable from "../components/BookingsTable";
import BookingsModal from "../components/BookingsModal";
import BookingsDelete from "../components/BookingsDelete";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

      <BookingsTable
        bookings={bookings}
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
