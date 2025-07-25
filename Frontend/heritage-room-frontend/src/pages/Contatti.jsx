import { Container, Row, Col } from "react-bootstrap";

export default function Contatti() {
  return (
    <Container className="mt-5">
      <Row className="gy-5 align-items-start">
        <Col md={6}>
          <h2 className="mb-4 fw-bold text-dark">Contatti</h2>
          <p className="fs-5">
            <i className="bi bi-envelope-fill me-2"></i>
            <strong>Email:</strong>{" "}
            <a href="mailto:info@heritageroom.it">info@heritageroom.it</a>
          </p>
          <p className="fs-5 ">
            <i className="bi bi-telephone-fill me-2"></i>
            <strong>Telefono:</strong>{" "}
            <a href="tel:+39061234567">+39 06 1234567</a>
          </p>
          <p className="fs-5">
            <i className="bi bi-box-arrow-up-right me-2"></i>
            <strong>Prenotazioni:</strong>{" "}
            <a href="https://www.booking.com/" target="_blank">
              Heritage Room su Booking.com
            </a>
          </p>
          <h2 className="my-4 fw-bold text-dark">Dove ci troviamo</h2>

          <div
            className="rounded shadow-sm overflow-hidden mb-3"
            style={{ height: "300px" }}
          >
            <iframe
              title="Mappa Heritage Room"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.640880950843!2d14.527264315542488!3d40.93160717930847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133ba98597961b79%3A0x34b70ad7f660e9cf!2sVia%20On.%20Francesco%20Napolitano%2C%20229%2C%2080035%20Nola%20NA!5e0!3m2!1sit!2sit!4v1721857573519!5m2!1sit!2sit"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="fs-5 text-muted">
            <i className="bi bi-geo-alt-fill me-2"></i>
            Via On. Francesco Napolitano 229, 80035 Nola (NA)
          </p>
        </Col>
      </Row>
    </Container>
  );
}
