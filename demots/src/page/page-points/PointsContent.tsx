import React, { useState } from "react";
import "./PointsContent.css";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Pulsante } from "../../components/msbutton/Button";
import lizard from "../../assets/images/lizard.jpg"; // Percorso del file locale
import points from "../../assets/images/points.jpg"; // Percorso del file locale
import CardGrid from "../../components/mscard/card";
import { logActivityByEmail } from "../page-activity/service/ActivityService";
import { findByEmail } from "./service/PointsService";
import { ResponseI, UserI } from "../../general/Utils";
import { showError } from "../../App";


interface PointsContentProps {
  user: UserI;
  setErrors: any;
}


const PointsContent: React.FC<PointsContentProps> = ({
  user,
  setErrors
}) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [testo, setTesto] = useState('');
  const [testoLog, setTestoLog] = useState([] as string[]);
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const padding = isVertical ? 5 : 8;

  const pulsanteLog: Pulsante = {
    icona: 'fas fa-clipboard',
    funzione: () => getLogAttivita(user), // Passi la funzione direttamente
    nome: 'red',
    title: 'Log Attività',
    visibility: user ? true : false
  };

  const cardsData = [
    {
      _id: 'card1',
      text: [testo], title: "Points", img: lizard, pulsanti: [] // Puoi aggiungere pulsanti qui se necessario
    },
    {
      _id: 'card2',
      text: testoLog, title: "Log Activity", img: points, pulsanti: [] // Puoi aggiungere pulsanti qui se necessario
    }
  ];



  // Crea l'array dei pulsanti in base all'orientamento

  const getUser = (email: string): void => {

    findByEmail(email, () => showError(setOpen, setErrors)).then((response: ResponseI) => {
      if (response) {
        if (response.status === 'OK') {
          setTesto(response.testo.numeroPunti)
          console.log('Dati ricevuti:', response);
        } else {
          setErrors(response.errors);
          setOpen(true);
        }
      }
    })
  }
  const getLogAttivita = (userI: UserI): void => {

    logActivityByEmail(userI, () => showError(setOpen, setErrors)).then((response: ResponseI) => {
      if (response) {
        if (response.status === 'OK') {
          setTestoLog(response.testo)
        } else {
          setErrors(response.errors);
          setOpen(true);
        }
      }
    })
  }
  if (testo === '') {
    getUser(user.email);
    getLogAttivita(user);
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        {/* Contenitore per i TextField */}
        <Box sx={{ marginBottom: 4 }}>
          <div id="cardData">
            <CardGrid cardsData={cardsData} />
          </div>
        </Box>
      </div>
    </>
  );
}
// Componente che visualizza il testo dallo store

export default PointsContent;
