import { Modal, Button } from "react-bootstrap";

export default function ClientDelete({ show, onHide, client, onConfirm }) {
  if (!client) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Conferma eliminazione</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Sei sicuro di voler eliminare il cliente <strong>{client.name}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annulla
        </Button>
        <Button variant="danger" onClick={() => onConfirm(client)}>
          Elimina
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
