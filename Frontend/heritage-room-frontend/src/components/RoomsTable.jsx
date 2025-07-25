import { Table, Button } from "react-bootstrap";

export default function RoomsTable({ rooms = [], onEdit, onDelete }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Prezzo per Notte</th>
          <th>Disponibile</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr key={room.id}>
            <td>{room.name}</td>
            <td>€{room.pricePerNight}</td>
            <td>{room.available ? "Sì" : "No"}</td>
            <td>
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-2"
                onClick={() => onEdit(room)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(room)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
