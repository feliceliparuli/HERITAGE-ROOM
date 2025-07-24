import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-light text-center text-muted py-3 mt-5 border-top">
      <Container>
        <small>
          © {new Date().getFullYear()} Heritage Room — Tutti i diritti riservati
        </small>
      </Container>
    </footer>
  );
}
