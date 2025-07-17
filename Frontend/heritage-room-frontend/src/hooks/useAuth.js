import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) return;

    fetch("http://localhost:8080/api/auth/me", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return user;
}
