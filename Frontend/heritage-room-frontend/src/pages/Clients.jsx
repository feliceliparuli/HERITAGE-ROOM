import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  const { email, status } = useSelector((state) => state.user);

  useEffect(() => {
    if (status !== "succeeded" || !email) return;

    fetch("/api/customers", {
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
        setClients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore durante il caricamento dei clienti:", err);
        setErrore("Errore durante il caricamento dei clienti");
        setLoading(false);
      });
  }, [email, status]);

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
