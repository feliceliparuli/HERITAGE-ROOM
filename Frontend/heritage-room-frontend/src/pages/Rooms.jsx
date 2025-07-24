import { useEffect, useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

import RoomsTable from "../components/RoomsTable";
import RoomModal from "../components/RoomModal";
import RoomDelete from "../components/RoomDelete";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      .catch(() => setError("Errore durante il caricamento delle stanze."));
  };

  useEffect(() => {
    if (role === "ADMIN") fetchRooms();
  }, [role]);

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleNew = () => {
    setEditingRoom(null);
    setShowModal(true);
  };

  const handleDelete = (room) => {
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
        if (!res.ok) throw new Error("Errore eliminazione stanza.");
        fetchRooms();
        setShowDeleteModal(false);
        setRoomToDelete(null);
      })
      .catch(() => setError("Impossibile eliminare la stanza."));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestione Stanze</h2>
        <Button onClick={handleNew}>Nuova Stanza</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <RoomsTable rooms={rooms} onEdit={handleEdit} onDelete={handleDelete} />

      <RoomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        editingRoom={editingRoom}
        onSave={fetchRooms}
      />

      <RoomDelete
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        room={roomToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
