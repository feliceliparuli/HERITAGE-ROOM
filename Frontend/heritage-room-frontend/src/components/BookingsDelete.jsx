import { Modal, Button } from "react-bootstrap";

export default function BookingsDelete({ show, onHide, booking, onConfirm }) {
  if (!booking) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Conferma eliminazione</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Sei sicuro di voler eliminare la prenotazione per la stanza "
        <strong>{booking.room?.name}</strong>" del cliente "
        <strong>{booking.customer?.name}</strong>"?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annulla
        </Button>
        <Button variant="danger" onClick={() => onConfirm(booking)}>
          <i className="bi bi-trash"></i>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
