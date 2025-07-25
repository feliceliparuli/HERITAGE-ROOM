import { Modal, Button } from "react-bootstrap";

export default function RoomDelete({ show, onHide, room, onConfirm }) {
  if (!room) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Conferma eliminazione</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Sei sicuro di voler eliminare la stanza <strong>{room.name}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annulla
        </Button>
        <Button variant="danger" onClick={() => onConfirm(room)}>
          <i className="bi bi-trash"></i>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
