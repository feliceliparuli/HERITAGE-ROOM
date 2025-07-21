import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  const { email, status } = useSelector((state) => state.user);

  useEffect(() => {
    if (status !== "succeeded" || !email) return;

    fetch("/api/rooms", {
      headers: {
        Authorization: "Basic " + localStorage.getItem("auth"),
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Errore HTTP: " + response.status);
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
  }, [email, status]);

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
