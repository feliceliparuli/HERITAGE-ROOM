import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerNight: "",
    available: true,
  });
  const [error, setError] = useState(null);

  const { role } = useSelector((state) => state.user);

  const fetchRooms = () => {
    fetch("/api/rooms", {
      headers: {
        Authorization: "Basic " + localStorage.getItem("auth"),
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setRooms)
      .catch(() =>
        setError("Errore durante il caricamento della lista stanze.")
      );
  };

  useEffect(() => {
    if (role === "ADMIN") fetchRooms();
  }, [role]);

  const handleClose = () => {
    setShowModal(false);
    setEditingRoom(null);
    setFormData({
      name: "",
      description: "",
      pricePerNight: "",
      available: true,
    });
    setError(null);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description,
      pricePerNight: room.pricePerNight,
      available: room.available,
    });
    setShowModal(true);
  };

  const confirmDelete = (room) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!roomToDelete) return;

    fetch(`/api/rooms/${roomToDelete.id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Basic " + localStorage.getItem("auth"),
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante l'eliminazione.");
        fetchRooms();
        setShowDeleteModal(false);
        setRoomToDelete(null);
      })
      .catch(() => setError("Impossibile eliminare la stanza."));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingRoom ? "PUT" : "POST";
    const url = editingRoom ? `/api/rooms/${editingRoom.id}` : "/api/rooms";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + localStorage.getItem("auth"),
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore salvataggio.");
        return res.json();
      })
      .then(() => {
        fetchRooms();
        handleClose();
      })
      .catch(() => setError("Errore durante il salvataggio."));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestione Stanze</h2>
        <Button onClick={() => setShowModal(true)}>Nuova Stanza</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrizione</th>
            <th>Prezzo per Notte</th>
            <th>Disponibile</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.description}</td>
              <td>€{room.pricePerNight}</td>
              <td>{room.available ? "Sì" : "No"}</td>
              <td>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(room)}
                >
                  Modifica
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => confirmDelete(room)}
                >
                  Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modale creazione/modifica stanza */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingRoom ? "Modifica Stanza" : "Nuova Stanza"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prezzo per Notte</Form.Label>
              <Form.Control
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Disponibile"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Salva
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modale conferma eliminazione */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Conferma eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sei sicuro di voler eliminare questa stanza?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annulla
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Rooms;
