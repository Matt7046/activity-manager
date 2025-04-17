import CloseIcon from '@mui/icons-material/Close';
import { Box, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Pagination, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../App";
import Button, { Pulsante } from "../../components/ms-button/Button";
import CardGrid, { CardProps, CardText, CardTextAlign } from "../../components/ms-card/Card";
import Label from '../../components/ms-label/Label';
import { upload } from '../../general/service/ImageService';
import { ButtonName, HttpStatus } from "../../general/structure/Constant";
import { getDateStringExtendsFormat, getDateStringRegularFormat, ResponseI, UserI } from "../../general/structure/Utils";
import { ActivityLogI } from "../page-activity/Activity";
import { logActivityByEmail } from "../page-activity/service/LogActivityService";
import { FamilyLogI } from '../page-family/Family';
import { logFamilyByEmail } from '../page-family/service/FamilyService';
import { TypeMessage } from "../page-layout/PageLayout";
import { findByEmail, saveUserImage } from "./service/UserPointService";
import { NameImageI, UserPointsI } from './UserPoint';
import "./UserPointContent.css";

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

  const [openDialogLogFamily, setOpenDialogLogFamily] = useState(false)   // Controlla la visibilità del messaggio

  const [openDialogLogActivity, setOpenDialogLogActivity] = useState(false)
  const [testo, setTesto] = useState('');
  const [testoLog, setTestoLog] = useState<ActivityLogI[]>([]);
  const [testoLogFamily, setTestoLogFamily] = useState<FamilyLogI[]>([]);
  const [logCard, setLogCard] = useState<boolean>(false);
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);
  const [changePoint, setChangePoint] = useState<boolean>();

  const [cardData, setCardData] = useState<CardProps[]>([]);
  const [nameImage, setNameImage] = useState<NameImageI[]>([]);
  const cardsDataId: string[] = ["userPointCard1", "userPointCard2", "userPointCard3"]

  useEffect(() => {
    getLogAttivita(user, false).then((response: void) => {
      getLogFamily(user, false);
    })

    return () => { };
  }, [inizialLoad]);

  useEffect(() => {
    if (logCard === true) {
      getPoints();
    }

    return () => { };
  }, [logCard]);


  useEffect(() => {
    if (cardData.length > 0) {
      const cardProps: CardProps[] = [
        {
          _id: cardsDataId[0],
          text: cardData[0].text,
          img: nameImage[0].name,
          title: "Punti",
          loadImage: (image: FormData) => saveImage(cardsDataId[0], image, user),
          children: renderChildren1(),
        },
        {

          _id: cardsDataId[1],
          text: cardData[1].text,
          img: nameImage[1].name,
          title: "Log Attività",
          loadImage: (image: FormData) => saveImage(cardsDataId[1], image, user),
          children: renderChildren2(openDialogLogActivity, handleCloseDialogLogActivity),
        },
        {

          _id: cardsDataId[2],
          text: cardData[2].text,
          img: nameImage[2].name,
          title: "Log Famiglia",
          loadImage: (image: FormData) => saveImage(cardsDataId[2], image, user),
          children: renderChildren3(false, handleCloseDialogLogFamily),
        }
      ];
      setCardData(cardProps);
    }
  }, [openDialogLogActivity]);



  useEffect(() => {
    if (cardData.length > 0) {
      const cardProps: CardProps[] = [
        {
          _id: cardsDataId[0],
          text: cardData[0].text,
          img: nameImage[0].name,
          title: "Punti",
          loadImage: (image: FormData) => saveImage(cardsDataId[0], image, user),
          children: renderChildren1(),
        },
        {

          _id: cardsDataId[1],
          text: cardData[1].text,
          img: nameImage[1].name,
          title: "Log Attività",
          loadImage: (image: FormData) => saveImage(cardsDataId[1], image, user),
          children: renderChildren2(false, handleCloseDialogLogActivity),
        },
        {

          _id: cardsDataId[2],
          text: cardData[2].text,
          img: nameImage[2].name,
          title: "Log Famiglia",
          loadImage: (image: FormData) => saveImage(cardsDataId[2], image, user),
          children: renderChildren3(openDialogLogFamily, handleCloseDialogLogFamily),
        }
      ];
      setCardData(cardProps);
    }
  }, [openDialogLogFamily]);

  const renderChildren1 = () => (
    <React.Fragment>
      <Button pulsanti={[]} />
    </React.Fragment>
  )

  const renderChildren2 = (open: boolean, onClose: () => void) => (
    <React.Fragment>
      <Grid container justifyContent="flex-end" spacing={2} >
        <Button pulsanti={[pulsanteLog]} />
        <Dialog
          onClose={onClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle id="customized-dialog-title">
            <Grid container spacing={2}>
              {/* Prima riga: Pulsanti per simulare il login */}
              <Grid size={{ xs: 11, sm: 11 }}>
                <div className="col-display">
                  <Label text={"LOG ATTIVITA'"} _id={"logActivity"} className='col-display' />
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
                          <Typography variant="subtitle1" className='text-message-point-title'>
                            {'Data: '}
                          </Typography>
                          <Typography variant="subtitle1" className='text-message-point-body'>
                            {getDateStringExtendsFormat(item.date)}
                          </Typography>
                          <Typography variant="body2" className='text-message-point-title'>
                            {'Punti usati: '}
                          </Typography>
                          <Typography variant="body2" className='text-message-point-body'>
                            {item.usePoints}
                          </Typography>
                          <Typography variant="body2" className='text-message-point-title'>
                            {'Descrizione: '}
                          </Typography>
                          <Typography variant="body2" className='text-message-point-body'>
                            {item.log}
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
                  className='pagination-activity'
                />
              </>
            ) : (
              <Typography variant="body2">
                {'Nessun dato disponibile.'}
              </Typography>
            )}
          </DialogContent>
          <DialogActions />
        </Dialog>
      </Grid>
    </React.Fragment>
  );

  const renderChildren3 = (open: boolean, onClose: () => void) => (
    <React.Fragment>
      <Grid container justifyContent="flex-end" spacing={2} >
        <Button pulsanti={[pulsanteLogFamily]} />

        <Dialog
          onClose={onClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle id="customized-dialog-title-family">
            <Grid container spacing={2}>
              {/* Prima riga: Pulsanti per simulare il login */}
              <Grid size={{ xs: 11, sm: 11 }}>
                <div className="col-display">
                  <Label text={"LOG FAMIGLIA"} _id={"logFamily"} className='col-display' />
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
                          <Typography variant="subtitle1" className='text-message-point-title'>
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
                  className='pagination-card'
                />
              </>
            ) : (
              <Typography variant="body2">
                {'Nessun dato disponibile.'}
              </Typography>
            )}
          </DialogContent>
          <DialogActions />
        </Dialog>
      </Grid>
    </React.Fragment>
  );



  const handleCloseDialogLogFamily = () => {
    setOpenDialogLogFamily(false);
  }

  const handleCloseDialogLogActivity = () => {
    setOpenDialogLogActivity(false);
  }

  const pulsanteLog: Pulsante = {
    icona: 'fas fa-clipboard',
    funzione: () => {
      setOpenDialogLogActivity(true); // prova a forzarlo
      getLogAttivita(user, true);

    },
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

  const saveImage = (_id: string, image: FormData, userPoint: UserPointsI, width?: number, height?: number): Promise<string> => {
    userPoint.nameImage = _id + image.get("extension");
    image.append("nameImage", _id);
    if (width) {
      image.delete("width");
      image.append("width", width.toString());
    }
    if (height) {
      image.delete("height");
      image.append("height", height.toString());
    }

    return upload(image, () => showMessage(setOpen, setMessage)).then((response: ResponseI | undefined) => {
      const url: string = response?.jsonText.url;
      const fileName = url.substring(url.lastIndexOf('upload/'));
      userPoint.nameImage = fileName;
      return saveUserImage(userPoint, () => showMessage(setOpen, setMessage)).then((response: ResponseI | undefined) => {
        if (response) {
          setChangePoint(!changePoint);
        }
        return fileName;
      })
    })

  }



  // Crea l'array dei pulsanti in base all'orientamento

  const getPoints = (): Promise<CardProps[] | undefined> => {
    const emailFind = user.emailFamily ? user.emailFamily : user.email;
    return findByEmail({ ...user, email: emailFind }, (message: any) => showMessage(setOpen, setMessage, message)).then((response: ResponseI | undefined) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          setTesto(response.jsonText.numeroPunti);
          const nameImage: NameImageI[] = response.jsonText.nameImage.map((x: string) => {
            return { name: x };
          }
          )
          setNameImage(nameImage);
          // Completa l'array fino a 3 elementi con { name: '' }
          while (nameImage.length < 3) {
            nameImage.push({ name: '' });
          }



          const CardTextAlign: CardTextAlign = {

            textLeft: response.jsonText.numeroPunti
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




          const cardProps: CardProps[] = [
            {
              _id: cardsDataId[0],
              text: cardText1,
              img: nameImage[0].name,
              title: "Punti",
              loadImage: (image: FormData) => saveImage(cardsDataId[0], image, user),
              children: renderChildren1(),
            },
            {

              _id: cardsDataId[1],
              text: cardText2,
              img: nameImage[1].name,
              title: "Log Attività",
              loadImage: (image: FormData) => saveImage(cardsDataId[1], image, user),
              children: renderChildren2(false, handleCloseDialogLogActivity),
            },
            {

              _id: cardsDataId[2],
              text: cardText3,
              img: nameImage[2].name,
              title: "Log Famiglia",
              loadImage: (image: FormData) => saveImage(cardsDataId[2], image, user),
              children: renderChildren3(false, handleCloseDialogLogFamily),
            }
          ];
          setCardData(cardProps);
          console.log('Dati ricevuti:', response);
          return cardData;
        }
      }
    })
  }
  const getLogAttivita = (userI: UserI, openDialog: boolean): Promise<void> => {
    const emailFind = user.emailFamily ? user.emailFamily : user.email;

    return logActivityByEmail({ ...userI, email: emailFind }, () => showMessage(setOpen, setMessage)).then((response: ResponseI | undefined) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          setTestoLog(response.jsonText)
          setOpenDialogLogActivity(openDialog);

        }
      }
    })
  }



  const getLogFamily = (userI: UserI, openDialog: boolean): Promise<void> => {
    const emailFind = user.emailFamily ? user.emailFamily : user.email;

    return logFamilyByEmail({ ...userI, email: emailFind }, () => showMessage(setOpen, setMessage)).then((response: ResponseI | undefined) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          setTestoLogFamily(response.jsonText)
          if (!openDialog) {
            setLogCard(true)
          } else {
            setOpenDialogLogFamily(true);
          }
        }
      }
    })
  }


  return (
    <>
      <div className="row">
        <Box >
          <div id="cardData">
            <CardGrid cardsData={cardData} />
          </div>
        </Box>
      </div>
    </>
  );
}
// Componente che visualizza il testo dallo store

export default PointsContent;
