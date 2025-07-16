import { useEffect, useState } from "react";

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/customers", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore HTTP: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore durante il caricamento dei clienti:", err);
        setErrore("Errore durante il caricamento dei clienti");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Caricamento clienti...</p>;
  if (errore) return <p>{errore}</p>;

  return (
    <div>
      <h2>Clienti</h2>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} - {client.email} - {client.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clients;
