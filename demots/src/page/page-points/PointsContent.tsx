import { Box, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showError } from "../../App";
import lizard from "../../assets/images/lizard.jpg"; // Percorso del file locale
import points from "../../assets/images/points.jpg"; // Percorso del file locale
import Button, { Pulsante } from "../../components/msbutton/Button";
import CardGrid, { CardProps } from "../../components/mscard/card";
import { ResponseI, UserI } from "../../general/Utils";
import { logActivityByEmail } from "../page-activity/service/ActivityService";
import "./PointsContent.css";
import { findByEmail } from "./service/PointsService";


interface PointsContentProps {
  user: UserI;
  setErrors: any;
}

interface AttivitaLog {
  _id: string;
  email: string;
  log: string;
  date: Date;
  pointsUse: number;

}

const PointsContent: React.FC<PointsContentProps> = ({
  user,
  setErrors
}) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [openDialog, setOpenDialog] = useState(false); // Controlla la visibilità del messaggio

  const [testo, setTesto] = useState('');
  const [testoLog, setTestoLog] = useState([] as AttivitaLog[]);
  const [testoLogT, setTestoLogT] = useState([] as AttivitaLog[]);


  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const padding = isVertical ? 5 : 8;

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }



  const pulsanteLog: Pulsante = {
    icona: 'fas fa-clipboard',
    funzione: () => getLogAttivita(user, true), // Passi la funzione direttamente
    nome: 'blue',
    title: 'Log Attività',
    visibility: user ? true : false
  };


  const children =
    <React.Fragment>
      <Button pulsanti={[pulsanteLog]} />
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
      >
        <DialogTitle id="customized-dialog-title" sx={{ m: 0, p: 2 }}>
          Modal title
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            ✖️
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>


          {/* Render condizionale del contenuto */}
          {testoLog.length > 1 ? (
            <Grid container spacing={3}>
              {testoLog.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      boxShadow: 3,
                      overflow: 'hidden',
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Data: {new Date(item.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Point Use: {item.pointsUse}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Description: {item.log}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
              Nessun dato disponibile.
            </Typography>
          )}


        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
    </React.Fragment>
    ;
  const cardsData: CardProps[] = [
    {
      _id: 'card1',
      text: [testo], title: "Points", img: lizard,
      pulsanti: [] // Puoi aggiungere pulsanti qui se necessario
    },
    {

      _id: 'card2',
      children: children,
      text: testoLogT.map((x) => x.log),
      title: "Log Activity",
      img: points,
      pulsanti: [] // Puoi aggiungere pulsanti qui se necessario
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
  const getLogAttivita = (userI: UserI, truncate: boolean): void => {

    logActivityByEmail(userI, () => showError(setOpen, setErrors)).then((response: ResponseI) => {
      if (response) {
        if (response.status === 'OK') {
          let attivitaLog = response.testo;
          if (attivitaLog.length > 3) {
            attivitaLog = attivitaLog.slice(0, 3).concat({log:'...'});
          }
          if (truncate) {
            setOpenDialog(true);
          }
          setTestoLogT(attivitaLog);
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
    getLogAttivita(user, false);
  }


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
