import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navigateRouting } from "../../App";
import { SectionName } from "../../general/Constant";

const BannerOpenSource: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate(); // Ottieni la funzione di navigazione

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email) {
      console.log("Email raccolta per il progetto open source:", email);
      setIsSubmitted(true);
      setEmail("");
    } else {
      alert("Inserisci un'email valida.");
    }
  };

  const handleClick = () => {
    navigateRouting(navigate, SectionName.POLICY, { newLogin: true })
  
  }

  return (
    <div style={styles.banner}>
      {isSubmitted ? (
        <p style={styles.thankYouMessage}>
          Grazie per esserti iscritto! Ti invieremo aggiornamenti sul nostro progetto open source.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.text}>
            Iscriviti per ricevere aggiornamenti sul nostro progetto open source.
            Tratteremo i tuoi dati personali esclusivamente per inviarti
            comunicazioni relative al progetto. Per maggiori dettagli, consulta la nostra{" "}
            <label onClick={handleClick} // Evento onClick per eseguire l'azione
              style={styles.link}>
              Privacy Policy

            </label>
          </label>

        </form>
      )}
    </div>
  );
};


const styles = {
  banner: {
    backgroundColor: "#f1f1f1",
    padding: "20px",
    textAlign: "center" as const,
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    margin: "20px auto",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  text: {
    fontSize: "14px",
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  thankYouMessage: {
    fontSize: "16px",
    color: "#28a745",
  },
  link: {
    color: "#007BFF",
    textDecoration: "underline",
  },
};

export default BannerOpenSource;

