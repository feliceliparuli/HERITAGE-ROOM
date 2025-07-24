import { Table, Button } from "react-bootstrap";

export default function BookingsTable({ bookings = [], onEdit, onDelete }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Stanza</th>
          <th>Cliente</th>
          <th>Check-in</th>
          <th>Check-out</th>
          <th>Notti</th>
          <th>Prezzo Totale</th>
          <th>Creata il</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b) => (
          <tr key={b.id}>
            <td>{b.room?.name}</td>
            <td>{b.customer?.name}</td>
            <td>{new Date(b.checkIn).toLocaleDateString("it-IT")}</td>
            <td>{new Date(b.checkOut).toLocaleDateString("it-IT")}</td>
            <td>{b.nights}</td>
            <td>
              {typeof b.totalPrice === "number"
                ? `€${b.totalPrice.toFixed(2)}`
                : "—"}
            </td>
            <td>
              {b.createdAt
                ? new Date(b.createdAt).toLocaleString("it-IT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </td>

            <td>
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-2"
                onClick={() => onEdit(b)}
              >
                Modifica
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(b)}
              >
                Elimina
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
