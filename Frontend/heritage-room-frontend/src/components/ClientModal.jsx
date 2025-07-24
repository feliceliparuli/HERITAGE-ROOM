import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function ClientModal({ show, onHide, editingClient, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "USER",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingClient) {
      setFormData({
        name: editingClient.name,
        email: editingClient.email,
        phone: editingClient.phone,
        password: "",
        role: editingClient.role,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "USER",
      });
    }
    setError(null);
  }, [editingClient, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingClient ? "PUT" : "POST";
    const url = editingClient
      ? `/api/customers/${editingClient.id}`
      : "/api/customers";

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
        onHide();
        onSave(); // ricarica la lista dopo salvataggio
      })
      .catch(() => setError("Errore durante il salvataggio."));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingClient ? "Modifica Cliente" : "Nuovo Cliente"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome e cognome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Telefono</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          {!editingClient && (
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          <Button type="submit" variant="primary">
            Salva
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
