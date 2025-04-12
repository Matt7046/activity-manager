import CloseIcon from '@mui/icons-material/Close';
import { Box, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Pagination, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../App";
import lizard from "../../assets/images/lizard.jpg"; // Percorso del file locale
import points from "../../assets/images/points.jpg"; // Percorso del file locale
import Button, { Pulsante } from "../../components/ms-button/Button";
import CardGrid, { CardProps } from "../../components/ms-card/Card";
import Label from '../../components/ms-label/Label';
import { ButtonName, HttpStatus } from "../../general/Constant";
import { ResponseI, UserI } from "../../general/Utils";
import { ActivityLogI } from "../page-activity/Activity";
import { logActivityByEmail } from "../page-activity/service/LogActivityService";
import { TypeMessage } from "../page-layout/PageLayout";
import "./PointsContent.css";
import { findByEmail } from "./service/PointsService";

interface PointsContentProps {
  user: UserI;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isVertical: boolean;
}


const PointsContent: React.FC<PointsContentProps> = ({
  user,
  setMessage,
  setOpen,
  isVertical
}) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const [openDialog, setOpenDialog] = useState(false); // Controlla la visibilità del messaggio
  const [testo, setTesto] = useState('');
  const [testoLog, setTestoLog] = useState([] as ActivityLogI[]);
  const [testoLogT, setTestoLogT] = useState([] as ActivityLogI[]);
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    getPoints();
    getLogAttivita(user, false);
    // Pulisci il listener al dismount
    return () => { };
  }, [inizialLoad]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  const pulsanteLog: Pulsante = {
    icona: 'fas fa-clipboard',
    funzione: () => getLogAttivita(user, true), // Passi la funzione direttamente
    nome: ButtonName.BLUE,
    title: 'Log Attività',
    visibility: user ? true : false,
    configDialogPulsante: { message: '', showDialog: false }
  };
  const logsPerPage = 8; // Numero di log per pagina
  const [page, setPage] = useState(1);
  // Gestisce il cambiamento della pagina
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const children = (
    <React.Fragment>
      <Grid container justifyContent="flex-end" spacing={2} sx={{ marginTop: 2 }}>
        <Button pulsanti={[pulsanteLog]} />

        <Dialog
          onClose={handleCloseDialog}
          aria-labelledby="customized-dialog-title"
          open={openDialog}
        >
          <DialogTitle id="customized-dialog-title" sx={{ m: 0, p: 2 }}>
            <Grid container spacing={2}>
              {/* Prima riga: Pulsanti per simulare il login */}
              <Grid size={{ xs: 12, sm: 11 }}>
                <div className="col-display">
                  <Label text={"LOG ACTIVITY"} _id={"logActivity"} className='col-display' />
                </div>
              </Grid>
              <Grid size={{ xs: 12, sm: 1 }}>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseDialog}
                  className="icon-button" >
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent dividers>
            {/* Aggiungi la paginazione per i log */}
            {testoLog.length > 0 ? (
              <>
                <Grid container spacing={2}>
                  {testoLog.slice((page - 1) * logsPerPage, page * logsPerPage).map((item, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={index} >
                      <Card>

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
      </Grid>
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
      text: [testo],
      img: points,
      title: "Points",
      // className: 'card-point', 
      pulsanti: [],
      children: children2,
    },
    {

      _id: 'card2',
      text: testoLogT.map((x) => {

        if (x.usePoints) {
          return x.log + ': ' + x.usePoints + " point"
        }
        return x.log;

      }),
      img: lizard,
      title: "Log Activity",
      //  className: 'card-point',
      pulsanti: [],
      children: children,
    }
  ];

  // Crea l'array dei pulsanti in base all'orientamento

  const getPoints = (): void => {
    const emailFind = user.emailFamily ? user.emailFamily : user.email;
    findByEmail({ ...user, email: emailFind }, (message: any) => showMessage(setOpen, setMessage, message)).then((response: ResponseI | undefined) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          setTesto(response.jsonText.numeroPunti)
          console.log('Dati ricevuti:', response);
        }
      }
    })
  }
  const getLogAttivita = (userI: UserI, truncate: boolean): void => {
    const emailFind = user.emailFamily ? user.emailFamily : user.email;

    logActivityByEmail({ ...userI, email: emailFind }, () => showMessage(setOpen, setMessage)).then((response: ResponseI | undefined) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          let attivitaLog = response.jsonText;
          if (attivitaLog.length > 8) {
            attivitaLog = attivitaLog.slice(0, 8).concat({ log: '...' });
          }
          if (truncate) {
            setOpenDialog(true);
          }
          setTestoLogT(attivitaLog);
          setTestoLog(response.jsonText)
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
