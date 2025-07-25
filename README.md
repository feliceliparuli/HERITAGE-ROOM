# Heritage Room

**Heritage Room** è un'applicazione web full-stack per la gestione delle prenotazioni in una struttura ricettiva.  
Include un pannello di amministrazione, sistema di prenotazione per clienti, autenticazione e interfaccia responsive.

---

## 🔧 Tecnologie utilizzate

- **Frontend**: React + Bootstrap 5
- **Backend**: Spring Boot (Java) + PostgreSQL
- **Autenticazione**: Basic Auth HTTP + Redux
- **Sicurezza**: Controllo accessi basato su ruoli (`ROLE_USER`, `ROLE_ADMIN`)

---

## 🚀 Avvio del progetto

### 1. Clona il repository

```bash
git clone https://github.com/tuo-username/heritage-room.git
cd heritage-room
```

---

## 🔽 Backend – Spring Boot

### Requisiti

- Java 17 o superiore
- Maven 3+
- PostgreSQL installato

### Passaggi

1. Crea un database PostgreSQL (es. `heritageroom`)
2. Configura le credenziali nel file `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/heritageroom
spring.datasource.username=tuo_utente
spring.datasource.password=la_tua_password
```

3. Avvia il backend:

```bash
./mvnw spring-boot:run
```

Il backend sarà disponibile su: `http://localhost:8080`

---

## 💻 Frontend – React

### Requisiti

- Node.js 18+
- npm o yarn

### Passaggi

```bash
cd frontend   # oppure nella cartella dove si trova React
npm install
npm run dev
```

Il frontend sarà disponibile su: `http://localhost:5173`

---

## 👤 Utenti predefiniti

| Ruolo | Email               | Password |
|-------|---------------------|----------|
| Admin | admin@example.com   | adminpass|
| Utente| user@example.com    | userpass |

---

## 📦 Funzionalità principali

- Login utente con Basic Auth (salvato in Redux + localStorage)
- Admin può gestire:
  - Stanze
  - Clienti
  - Prenotazioni
- Utente può:
  - Visualizzare e gestire le proprie prenotazioni
- Validazione delle date e disponibilità delle stanze
- Layout responsive con Bootstrap
- Pagine pubbliche: Home, Contatti, Prenota dove puoi registrare un nuovo utente

---
