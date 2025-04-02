import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Privacy Policy</h1>
      <p style={styles.text}>
        La presente Privacy Policy descrive come raccogliamo, utilizziamo e
        proteggiamo i tuoi dati personali quando utilizzi il nostro progetto
        open source. La tua privacy è importante per noi, e ci impegniamo a
        trattare i tuoi dati in conformità al Regolamento Generale sulla
        Protezione dei Dati (GDPR).
      </p>

      <h2 style={styles.subtitle}>1. Dati personali raccolti</h2>
      <p style={styles.text}>
        Raccogliamo i seguenti dati personali quando ti iscrivi alla nostra
        newsletter o utilizzi i nostri servizi:
      </p>
      <ul style={styles.list}>
        <li>Email</li>
        <li>Eventuali altri dati forniti volontariamente tramite i moduli del
            nostro sito</li>
      </ul>

      <h2 style={styles.subtitle}>2. Finalità del trattamento</h2>
      <p style={styles.text}>
        Utilizziamo i tuoi dati personali per i seguenti scopi:
      </p>
      <ul style={styles.list}>
        <li>Inviarti aggiornamenti sul progetto open source</li>
        <li>Comunicarti nuove funzionalità, eventi o opportunità di contribuire</li>
        <li>Accedere alla applicazione </li>
      </ul>

      <h2 style={styles.subtitle}>3. Conservazione dei dati</h2>
      <p style={styles.text}>
        I tuoi dati personali saranno conservati solo per il tempo necessario
        per le finalità sopra indicate, salvo diversa richiesta legale o
        consenso esplicito.
      </p>

      <h2 style={styles.subtitle}>4. Diritti dell'utente</h2>
      <p style={styles.text}>
        Ai sensi del GDPR, hai il diritto di:
      </p>
      <ul style={styles.list}>
        <li>Accedere ai tuoi dati personali</li>
        <li>Richiedere la correzione o la cancellazione dei tuoi dati</li>
        <li>Revocare il consenso al trattamento</li>
        <li>Portabilità dei dati</li>
        <li>Opporsi al trattamento dei dati</li>
      </ul>
      <p style={styles.text}>
        Per esercitare questi diritti, puoi contattarci all'indirizzo email:{" "}
        <a href="mailto:matteo.santangelo@colorsdev.tech" style={styles.link}>
        matteo.santangelo@colorsdev.tech
        </a>.
      </p>

      <h2 style={styles.subtitle}>5. Sicurezza dei dati</h2>
      <p style={styles.text}>
        Adottiamo misure tecniche e organizzative adeguate per proteggere i tuoi
        dati personali da accessi non autorizzati, perdite o divulgazioni.
      </p>

      <h2 style={styles.subtitle}>6. Modifiche alla Privacy Policy</h2>
      <p style={styles.text}>
        Potremmo aggiornare questa Privacy Policy di tanto in tanto. Ti
        invitiamo a controllare periodicamente questa pagina per eventuali
        modifiche.
      </p>

      <p style={styles.text}>
        Ultimo aggiornamento: 18 gennaio 2025.
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold" as const,
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "24px",
    fontWeight: "bold" as const,
    marginTop: "20px",
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  list: {
    paddingLeft: "20px",
    marginBottom: "10px",
  },
  link: {
    color: "#007BFF",
    textDecoration: "none",
  },
};

export default PrivacyPolicy;
