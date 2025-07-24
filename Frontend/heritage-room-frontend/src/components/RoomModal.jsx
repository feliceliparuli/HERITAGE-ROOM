import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function RoomModal({ show, onHide, editingRoom, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerNight: "",
    available: true,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingRoom) {
      setFormData({
        name: editingRoom.name,
        description: editingRoom.description,
        pricePerNight: editingRoom.pricePerNight,
        available: editingRoom.available,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        pricePerNight: "",
        available: true,
      });
    }
    setError(null);
  }, [editingRoom, show]);

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
        if (!res.ok) throw new Error("Errore salvataggio stanza.");
        return res.json();
      })
      .then(() => {
        onHide();
        onSave();
      })
      .catch(() => setError("Errore durante il salvataggio."));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingRoom ? "Modifica Stanza" : "Nuova Stanza"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

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
  );
}
