import { Table, Button } from "react-bootstrap";

export default function ClientsTable({ clients = [], onEdit, onDelete }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nome e cognome</th>
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
                onClick={() => onEdit(client)}
              >
                Modifica
              </Button>
              {client.role !== "ADMIN" && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(client)}
                >
                  Elimina
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
