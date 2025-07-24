import { useEffect, useState } from "react";
import { Button, Alert } from "react-bootstrap";
import ClientsTable from "../components/ClientsTable";
import ClientModal from "../components/ClientModal";
import ClientDelete from "../components/ClientDelete";
import { useSelector } from "react-redux";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleNew = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  const handleDelete = (client) => {
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestione Clienti</h2>
        <Button onClick={handleNew}>Nuovo Cliente</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <ClientsTable
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ClientModal
        show={showModal}
        onHide={() => setShowModal(false)}
        editingClient={editingClient}
        onSave={fetchClients}
      />

      <ClientDelete
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        client={clientToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
