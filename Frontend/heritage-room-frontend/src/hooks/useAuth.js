import { useState } from "react";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // "ADMIN" o "USER"

  function loginAsAdmin() {
    setIsAuthenticated(true);
    setRole("ADMIN");
  }

  function loginAsUser() {
    setIsAuthenticated(true);
    setRole("USER");
  }

  function logout() {
    setIsAuthenticated(false);
    setRole(null);
  }

  return { isAuthenticated, role, loginAsAdmin, loginAsUser, logout };
}
