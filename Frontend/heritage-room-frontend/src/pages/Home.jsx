import { Container, Row, Col, Carousel } from "react-bootstrap";

export default function Home() {
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-5 display-4 fw-semibold text-dark">
        Benvenuti su Heritage Room
      </h1>

      {/* Sezione: Le nostre camere */}
      <Row className="align-items-center mb-5">
        <Col md={6} className="pe-md-5">
          <h2 className="mb-4 fw-bold text-dark">Le nostre camere</h2>
          <p className="fs-5 text-muted" style={{ lineHeight: "1.8" }}>
            Heritage Room è una struttura ricettiva situata a Nola, in provincia
            di Napoli, che dispone di{" "}
            <strong className="text-dark">
              due camere con balcone in comune
            </strong>
            , spaziose e moderne, pensate per offrire{" "}
            <em>comfort, eleganza e tranquillità</em> ai nostri ospiti.
          </p>
          <p className="fs-5 text-muted" style={{ lineHeight: "1.8" }}>
            Ogni ambiente è curato nei minimi dettagli per garantire un
            soggiorno piacevole e rilassante.
          </p>
        </Col>
        <Col md={6}>
          <Carousel>
            {[
              "camera1.webp",
              "camera2.webp",
              "camera3.webp",
              "camera4.webp",
              "camera5.webp",
            ].map((img, i) => (
              <Carousel.Item key={i}>
                <img
                  className="d-block w-100 shadow"
                  src={`/${img}`}
                  alt={`Camera ${i + 1}`}
                  style={{
                    maxHeight: "450px",
                    objectFit: "cover",
                    borderRadius: "16px",
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>

      {/* Sezione: Dove ci troviamo */}
      <Row className="align-items-center flex-md-row-reverse mb-5">
        <Col md={6} className="ps-md-5">
          <h2 className="mb-4 fw-bold text-dark">Dove ci troviamo</h2>
          <p className="fs-5 text-muted" style={{ lineHeight: "1.8" }}>
            Siamo a <strong className="text-dark">Nola</strong>, una delle città
            più antiche della Campania, ricca di storia e tradizione. Nota per
            la <em>Festa dei Gigli</em>, è il luogo perfetto dove cultura e
            ospitalità si incontrano.
          </p>
          <p className="fs-5 text-muted" style={{ lineHeight: "1.8" }}>
            Il nostro alloggio si trova in una posizione strategica, facilmente
            raggiungibile e ben collegata.
          </p>
        </Col>
        <Col md={6}>
          <Carousel>
            {[
              "gigli.jpg",
              "duomo.jpg",
              "basiliche.jpg",
              "anfiteatro.jpeg",
              "villaggio.jpg",
            ].map((img, i) => (
              <Carousel.Item key={i}>
                <img
                  className="d-block w-100 shadow"
                  src={`/${img}`}
                  alt={`Nola ${i + 1}`}
                  style={{
                    maxHeight: "450px",
                    objectFit: "cover",
                    borderRadius: "16px",
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
}
