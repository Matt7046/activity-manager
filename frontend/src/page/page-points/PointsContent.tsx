import { Box, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Pagination, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../App";
import lizard from "../../assets/images/lizard.jpg"; // Percorso del file locale
import points from "../../assets/images/points.jpg"; // Percorso del file locale
import Button, { Pulsante } from "../../components/ms-button/Button";
import CardGrid, { CardProps } from "../../components/ms-card/Card";
import { HttpStatus, ResponseI, UserI } from "../../general/Utils";
import { ActivityLogI } from "../page-activity/Activity";
import { logActivityByEmail } from "../page-activity/service/ActivityService";
import { TypeMessage } from "../page-layout/PageLayout";
import "./PointsContent.css";
import { findByEmail } from "./service/PointsService";


interface PointsContentProps {
  user: UserI;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const PointsContent: React.FC<PointsContentProps> = ({
  user,
  setMessage,
  setOpen,
}) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const [openDialog, setOpenDialog] = useState(false); // Controlla la visibilità del messaggio
  const [testo, setTesto] = useState('');
  const [testoLog, setTestoLog] = useState([] as ActivityLogI[]);
  const [testoLogT, setTestoLogT] = useState([] as ActivityLogI[]);


  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);

  useEffect(() => {
    getPoints();
    getLogAttivita(user, false);
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    visibility: user ? true : false,
    configDialogPulsante: {message:'', showDialog:false}
  };    
  const logsPerPage = 8; // Numero di log per pagina
  const [page, setPage] = useState(1);
  // Gestisce il cambiamento della pagina
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const children = (
    <React.Fragment>
      <Button pulsanti={[pulsanteLog]} />
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
      >
        <DialogTitle id="customized-dialog-title" sx={{ m: 0, p: 2 }}>
          Log Activity
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
          {/* Aggiungi la paginazione per i log */}
          {testoLog.length > 0 ? (
            <>
              <Grid container spacing={2}>
                {testoLog.slice((page - 1) * logsPerPage, page * logsPerPage).map((item, index) => (
                   <Grid size={{ xs: 12, sm: 6 }} key={index} >
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
                          Use Points: {item.usePoints}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Description: {item.log}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {/* Paginazione per i log */}
              <Pagination
                count={Math.ceil(testoLog.length / logsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
              />
            </>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
              Nessun dato disponibile.
            </Typography>
          )}
        </DialogContent>
        <DialogActions />
      </Dialog>
    </React.Fragment>
  );  

  const children2 =
    <React.Fragment>
      <Button pulsanti={[]} />
    </React.Fragment>
    ;
  const cardsData: CardProps[] = [
    {
      _id: 'card1',
      text: [testo], title: "Points", img: lizard,
      pulsanti: [], // Puoi aggiungere pulsanti qui se necessario
      children: children2
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

  const getPoints = (): void => {
    const emailFind = user.emailFamily ? user.emailFamily: user.email;
    findByEmail({...user, email: emailFind}, (message: any) => showMessage(setOpen, setMessage, message)).then((response: ResponseI) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          setTesto(response.testo.numeroPunti)
          console.log('Dati ricevuti:', response);
        }
      }
    })
  }
  const getLogAttivita = (userI: UserI, truncate: boolean): void => {
    const emailFind = user.emailFamily ? user.emailFamily: user.email;

    logActivityByEmail({...userI, email: emailFind}, () => showMessage(setOpen, setMessage)).then((response: ResponseI) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          let attivitaLog = response.testo;
          if (attivitaLog.length > 3) {
            attivitaLog = attivitaLog.slice(0, 3).concat({ log: '...' });
          }
          if (truncate) {
            setOpenDialog(true);
          }
          setTestoLogT(attivitaLog);
          setTestoLog(response.testo)
        }
      }
    })
  }



  return (
    <>
      <div className="row">
        <Box sx={{ padding: 2 }}>
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
