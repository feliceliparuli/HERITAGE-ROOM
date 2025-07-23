import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

function Clients() {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState(null);

  const { role } = useSelector((state) => state.user);

  const fetchClients = () => {
    fetch("/api/customers", {
      headers: {
        Authorization: "Basic " + localStorage.getItem("auth"),
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setClients)
      .catch(() =>
        setError("Errore durante il caricamento della lista clienti.")
      );
  };

  useEffect(() => {
    if (role === "ADMIN") fetchClients();
  }, [role]);

  const handleClose = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "USER",
    });
    setError(null);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      password: "",
      role: client.role,
    });
    setShowModal(true);
  };

  const confirmDelete = (client) => {
    if (client.role === "ADMIN") {
      alert("Non puoi eliminare un account admin.");
      return;
    }
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!clientToDelete) return;

    fetch(`/api/customers/${clientToDelete.id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Basic " + localStorage.getItem("auth"),
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante l'eliminazione.");
        fetchClients();
        setShowDeleteModal(false);
        setClientToDelete(null);
      })
      .catch(() => setError("Impossibile eliminare il cliente."));
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
        fetchClients();
        handleClose();
      })
      .catch(() => setError("Errore durante il salvataggio."));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestione Clienti</h2>
        <Button onClick={() => setShowModal(true)}>Nuovo Cliente</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Ruolo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>{client.role}</td>
              <td>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(client)}
                >
                  Modifica
                </Button>
                {client.role !== "ADMIN" && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => confirmDelete(client)}
                  >
                    Elimina
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modale creazione/modifica */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingClient ? "Modifica Cliente" : "Nuovo Cliente"}
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

      {/* Modale conferma eliminazione */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Conferma eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sei sicuro di voler eliminare questo cliente?</Modal.Body>
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

export default Clients;
