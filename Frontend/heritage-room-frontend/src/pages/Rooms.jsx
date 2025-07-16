import { useEffect, useState } from "react";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/rooms", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore HTTP: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore durante il caricamento delle stanze:", err);
        setErrore("Errore durante il caricamento delle stanze");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Caricamento stanze...</p>;
  if (errore) return <p>{errore}</p>;

  return (
    <div>
      <h2>Stanze</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name} - €{room.pricePerNight} / notte
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Rooms;
