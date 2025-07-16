import { useEffect, useState } from "react";
import axios from "axios";

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/rooms")
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>Lista Stanze</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name} - {room.pricePerNight}€
          </li>
        ))}
      </ul>
    </div>
  );
}
