import CloseIcon from '@mui/icons-material/Close';
import { Box, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Pagination, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../App";
import lizard from "../../assets/images/lizard.jpg"; // Percorso del file locale
import points from "../../assets/images/points.jpg"; // Percorso del file locale
import Button, { Pulsante } from "../../components/ms-button/Button";
import CardGrid, { CardProps, CardText, CardTextAlign } from "../../components/ms-card/Card";
import Label from '../../components/ms-label/Label';
import { ButtonName, HttpStatus } from "../../general/Constant";
import { getDateStringRegularFormat, getDateStringExtendsFormat, ResponseI, UserI } from "../../general/Utils";
import { ActivityLogI } from "../page-activity/Activity";
import { logActivityByEmail } from "../page-activity/service/LogActivityService";
import { FamilyLogI } from '../page-family/Family';
import { logFamilyByEmail } from '../page-family/service/FamilyService';
import { TypeMessage } from "../page-layout/PageLayout";
import "./UserPointContent.css";
import { findByEmail } from "./service/UserPointService";

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
  const [openDialogLogFamily, setOpenDialogLogFamily] = useState(false); // Controlla la visibilità del messaggio
  const [openDialogLogActivity, setOpenDialogLogActivity] = useState(false); // Controlla la visibilità del messaggio
  const [testo, setTesto] = useState('');
  const [testoLog, setTestoLog] = useState<ActivityLogI[]>([]);
  const [testoLogFamily, setTestoLogFamily] = useState<FamilyLogI[]>([]);
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    getPoints();
    getLogAttivita(user, false);
    getLogFamily(user, false);
    // Pulisci il listener al dismount
    return () => { };
  }, [inizialLoad]);

  const handleCloseDialogLogFamily = () => {
    setOpenDialogLogFamily(false);
  }

  const handleCloseDialogLogActivity = () => {
    setOpenDialogLogActivity(false);
  }

  const pulsanteLog: Pulsante = {
    icona: 'fas fa-clipboard',
    funzione: () => getLogAttivita(user, true), // Passi la funzione direttamente
    nome: ButtonName.BLUE,
    title: 'Log Attività',
    visibility: user ? true : false,
    configDialogPulsante: { message: '', showDialog: false }
  };
  
  const pulsanteLogFamily: Pulsante = {
    icona: 'fas fa-clipboard',
    funzione: () => getLogFamily(user, true), // Passi la funzione direttamente
    nome: ButtonName.BLUE,
    title: 'Log Family',
    visibility: user ? true : false,
    configDialogPulsante: { message: '', showDialog: false }
  };
  const logsPerPage = 8; // Numero di log per pagina
  const [page, setPage] = useState(1);
  // Gestisce il cambiamento della pagina
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const children1 =
    <React.Fragment>
      <Button pulsanti={[]} />
    </React.Fragment>

  const children2 = (
    <React.Fragment>
      <Grid container justifyContent="flex-end" spacing={2} >
        <Button pulsanti={[pulsanteLog]} />

        <Dialog
          onClose={handleCloseDialogLogActivity}
          aria-labelledby="customized-dialog-title"
          open={openDialogLogActivity}
        >
          <DialogTitle id="customized-dialog-title">
            <Grid container spacing={2}>
              {/* Prima riga: Pulsanti per simulare il login */}
              <Grid size={{ xs: 11, sm: 11 }}>
                <div className="col-display">
                  <Label text={"LOG ACTIVITY"} _id={"logActivity"} className='col-display' />
                </div>
              </Grid>
              <Grid size={{ xs: 1, sm: 1 }}>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseDialogLogActivity}
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
                      <Card >

                        <CardContent className='text-card-point'>
                          <Typography variant="subtitle1">
                            {'Data: '+ getDateStringExtendsFormat(item.date)}
                          </Typography>
                          <Typography variant="body2" className='text-message-point-body'>
                            {'Use Points: '+ item.usePoints}
                          </Typography>
                          <Typography variant="body2" classes='text-message-point-body'>
                            {'Description: '+ item.log}
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
                {'Nessun dato disponibile.'}
              </Typography>
            )}
          </DialogContent>
          <DialogActions />
        </Dialog>
      </Grid>
    </React.Fragment>
  );

  const children3 = (
    <React.Fragment>
      <Grid container justifyContent="flex-end" spacing={2} >
        <Button pulsanti={[pulsanteLogFamily]} />

        <Dialog
          onClose={handleCloseDialogLogFamily}
          aria-labelledby="customized-dialog-title"
          open={openDialogLogFamily}
        >
          <DialogTitle id="customized-dialog-title-family">
            <Grid container spacing={2}>
              {/* Prima riga: Pulsanti per simulare il login */}
              <Grid size={{ xs: 11, sm: 11 }}>
                <div className="col-display">
                  <Label text={"LOG FAMILY"} _id={"logFamily"} className='col-display' />
                </div>
              </Grid>
              <Grid size={{ xs: 1, sm: 1 }}>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseDialogLogFamily}
                  className="icon-button" >
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent dividers>
            {/* Aggiungi la paginazione per i log */}
            {testoLogFamily.length > 0 ? (
              <>
                <Grid container spacing={2}>
                  {testoLogFamily.slice((page - 1) * logsPerPage, page * logsPerPage).map((item, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={index} >
                      <Card >

                        <CardContent className='text-card-point'>
                          <Typography variant="subtitle1"  className='text-message-point-title'>
                            {'Data: '}
                          </Typography>
                          <Typography variant="subtitle1">
                            {getDateStringExtendsFormat(item.date)}
                          </Typography>
                          <Typography variant="body2" className='text-message-point-title'>
                            {'Email inviante: '}
                          </Typography>
                          <Typography variant="body2" className='text-message-point-body'>
                            {item.performedByEmail}
                          </Typography>
                          <Typography variant="body2" className='text-message-point-title'>
                            {'Email ricevente: '}
                          </Typography>
                          <Typography variant="body2" className='text-message-point-body'>
                            {item.receivedByEmail}
                          </Typography>
                          <Typography variant="body2" className='text-message-point-title'>
                            {'Tipo operazione: '}
                          </Typography>
                          <Typography variant="body2" className='text-message-point-body'>
                            {item.operations}
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
                {'Nessun dato disponibile.'}
              </Typography>
            )}
          </DialogContent>
          <DialogActions />
        </Dialog>
      </Grid>
    </React.Fragment>
  );

  const CardTextAlign: CardTextAlign = {

    textLeft: testo
  }

  const textAlign1: CardTextAlign[] = [CardTextAlign]

  const cardText1: CardText = {
    textLeftTitle: 'Descrizione',
    text: textAlign1
  }


  const textAlign2: CardTextAlign[] = testoLog.map((x) => {

    return {

      textLeft: x.log,
      textRight: x.usePoints + " points"
    }
  });

  const cardText2: CardText = {
    textLeftTitle: 'Attività',
    textRightTitle: 'Punti usati',
    text: textAlign2
  }

  const textAlign3: CardTextAlign[] = testoLogFamily.map((x) => {
    return {
      textLeft: getDateStringRegularFormat(x.date),
      textRight: x.operations
    }
  });

  const cardText3: CardText = {
    textLeftTitle: 'Data',
    textRightTitle: 'Operazione',
    text: textAlign3
  }


  const cardsData: CardProps[] = [
    {
      _id: 'card1',
      text: cardText1,
      img: points,
      title: "Punti",
      // className: 'card-point', 
      pulsanti: [],
      children: children1,
    },
    {

      _id: 'card2',
      text: cardText2,
      img: lizard,
      title: "Log Attività",
      //  className: 'card-point',
      pulsanti: [],
      children: children2,
    },
    {

      _id: 'card3',
      text: cardText3,
      img: lizard,
      title: "Log Famiglia",
      //  className: 'card-point',
      pulsanti: [],
      children: children3,
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
            setOpenDialogLogActivity(true);
          }
          setTestoLog(response.jsonText)
        }
      }
    })
  }

  const getLogFamily = (userI: UserI, truncate: boolean): void => {
    const emailFind = user.emailFamily ? user.emailFamily : user.email;

    logFamilyByEmail({ ...userI, email: emailFind }, () => showMessage(setOpen, setMessage)).then((response: ResponseI | undefined) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          let attivitaLog = response.jsonText;
          if (attivitaLog.length > 8) {
            attivitaLog = attivitaLog.slice(0, 8).concat({ log: '...' });
          }
          if (truncate) {
            setOpenDialogLogFamily(true);
          }
          setTestoLogFamily(response.jsonText)
        }
      }
    })
  }


  return (
    <>
      <div className="row">
        <Box >
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
