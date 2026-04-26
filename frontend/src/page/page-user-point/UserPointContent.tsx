import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react";
import CloseIcon from '@mui/icons-material/Close';
import { Box, Card, CardContent, Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertConfig } from '../../components/ms-alert/Alert';
import Button, { Pulsante } from "../../components/ms-button/Button";
import CardGrid, { CardProps, CardText, CardTextAlign } from "../../components/ms-card/Card";
import { upload } from '../../general/service/ImageService';
import { ButtonName, HttpStatus } from "../../general/structure/Constant";
import { getDateStringExtendsFormat, getDateStringRegularFormat, ResponseI, UserI } from "../../general/structure/Utils";
import { ActivityLogI } from "../page-activity/Activity";
import { getLogActivityByEmail } from '../page-activity/service/LogActivityService';
import { FamilyLogI } from '../page-family/Family';
import { getLogFamilyByEmail } from '../page-family/service/FamilyService';
import { showMessage } from "../page-home/HomeContent";
import { findByEmail, saveUserImage } from "./service/UserPointService";
import { NameImageI, UserPointsI } from './UserPoint';
import "./UserPointContent.css";

interface PointsContentProps {
  user: UserI;
  alertConfig: AlertConfig;
  isVertical: boolean;
}


const PointsContent: React.FC<PointsContentProps> = ({
  user,
  alertConfig,
  isVertical
}) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione

  const [openDialogLogFamily, setOpenDialogLogFamily] = useState(false)   // Controlla la visibilità del messaggio

  const [openDialogLogActivity, setOpenDialogLogActivity] = useState(false)
  const [testo, setTesto] = useState('');
  const [testoLog, setTestoLog] = useState<ActivityLogI[]>([]);
  const [testoLogFamily, setTestoLogFamily] = useState<FamilyLogI[]>([]);
  const [testoLogUnpaged, setTestoLogUnpaged] = useState<ActivityLogI[]>([]);
  const [testoLogFamilyUnpaged, setTestoLogFamilyUnpaged] = useState<FamilyLogI[]>([]);
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
          ...cardData[0],
          children: renderChildren1(),
        },
        {
          ...cardData[1],
          children: renderChildren2(openDialogLogActivity),
        },
        {
          ...cardData[2],
          children: renderChildren3(false),
        },
      ];
      setCardData(cardProps);
    }
  }, [openDialogLogActivity]);



  useEffect(() => {
    if (cardData.length > 0) {
      const cardProps: CardProps[] = [
        {
          ...cardData[0],
          children: renderChildren1(),
        },
        {
          ...cardData[1],
          children: renderChildren2(false),
        },
        {
          ...cardData[2],
          children: renderChildren3(openDialogLogFamily),
        },
      ];
      setCardData(cardProps);
    }
  }, [openDialogLogFamily]);

  const renderChildren1 = () => (
    <React.Fragment>
      <Button pulsanti={[]} />
    </React.Fragment>
  )

  // Modifica dei renderChildren all'interno di PointsContent

  // ... (tutti gli import rimangono invariati)

 const renderChildren2 = (open: boolean) => (
  <React.Fragment>
    <Grid container justifyContent="flex-end" spacing={2} >
      <Button pulsanti={[pulsanteLog]} />
      <Dialog
        onClose={handleCloseDialogLogActivity}
        open={open}
        maxWidth="lg"
        fullWidth
        PaperProps={{ className: 'dialog-log-custom' }}
      >
        <div className="log-header-container">
          <Typography className="log-title-text"><Trans id="log_attivita" /></Typography>
          <IconButton onClick={handleCloseDialogLogActivity} size="small">
            <CloseIcon />
          </IconButton>
        </div>

        <DialogContent className="log-content-area">
          {testoLogUnpaged.length > 0 ? (
            <div className="log-scroll-container">
              {testoLogUnpaged.map((item, index) => (
                <div className="log-card-scroll-item" key={index}>
                  <Card className="log-card-item" elevation={0}>
                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Typography className="log-label"><Trans id="data_operazione" /></Typography>
                      <Typography className="log-value">{getDateStringExtendsFormat(item.date)}</Typography>
                      
                      <Typography className="log-label"><Trans id="punti" /></Typography>
                      <Typography className="log-value">
                        <span className="points-badge">{item.usePoints}</span>
                      </Typography>
                      
                      <div className="log-card-footer">
                          <Typography className="log-label"><Trans id="descrizione" /></Typography>
                          <Typography className="log-footer-text" sx={{ fontStyle: 'italic' }}>
                            {item.log}
                          </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Typography sx={{ textAlign: 'center', py: 8, color: '#94a3b8' }}>
              <Trans id="nessuna_attivita_registrata" />
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  </React.Fragment>
);

const renderChildren3 = (open: boolean) => (
  <React.Fragment>
    <Grid container justifyContent="flex-end" spacing={2}>
      <Button pulsanti={[pulsanteLogFamily]} />
      <Dialog
        onClose={handleCloseDialogLogFamily}
        open={open}
        maxWidth="lg"
        fullWidth
        PaperProps={{ className: 'dialog-log-custom' }}
      >
        <div className="log-header-container">
          <Typography className="log-title-text"><Trans id="log_famiglia" /></Typography>
          <IconButton onClick={handleCloseDialogLogFamily} size="small">
            <CloseIcon />
          </IconButton>
        </div>

        <DialogContent className="log-content-area">
          {testoLogFamilyUnpaged.length > 0 ? (
            <div className="log-scroll-container">
              {testoLogFamilyUnpaged.map((item, index) => (
                <div className="log-card-scroll-item" key={index}>
                  <Card className="log-card-item" elevation={0}>
                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                      
                      <Typography className="log-label"><Trans id="data" /></Typography>
                      <Typography className="log-value">{getDateStringExtendsFormat(item.date)}</Typography>
                      
                      <Typography className="log-label"><Trans id="operazione" /></Typography>
                      <Typography component="div" className="log-value">
                        {item.operations === 'FAMILY_REMOVE' ? (
                          <span className="log-value-highlight-red">{item.operations}</span>
                        ) : (
                          <span className="log-value-highlight">{item.operations}</span>
                        )}
                      </Typography>

                      <div className="log-card-footer">
                        <Typography className="log-label"><Trans id="eseguito_da_a" /></Typography>
                        <Typography className="log-footer-text">
                          <strong>Da:</strong> {item.performedByEmail}
                        </Typography>
                        <Typography className="log-footer-text">
                          <strong>A:</strong> {item.receivedByEmail}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Typography sx={{ textAlign: 'center', py: 8, color: '#94a3b8' }}>
              <Trans id="nessun_log_familiare_trovato" />
            </Typography>
          )}
        </DialogContent>
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
      getLogAttivita(user, true);

    },
    nome: ButtonName.BLUE,
    title: i18n._("log_attivita"),
    visibility: user ? true : false,
    configDialogPulsante: { message: '', showDialog: false }
  };

  const pulsanteLogFamily: Pulsante = {
    icona: 'fas fa-clipboard',
    funzione: () => getLogFamily(user, true), // Passi la funzione direttamente
    nome: ButtonName.BLUE,
    title: i18n._("log_family"),
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

    return upload(image, () => showMessage(alertConfig.setOpen, alertConfig.setMessage)).then((response: ResponseI | undefined) => {
      const url: string = response?.jsonText.url;
      const fileName = url.substring(url.lastIndexOf('upload/'));
      userPoint.nameImage = fileName;
      userPoint.email = user.emailChild;
      return saveUserImage(userPoint, () => showMessage(alertConfig.setOpen, alertConfig.setMessage)).then((response: ResponseI | undefined) => {
        if (response) {
          setChangePoint(!changePoint);
        }
        return fileName;
      })
    })

  }



  // Crea l'array dei pulsanti in base all'orientamento

  const getPoints = (): Promise<CardProps[] | undefined> => {
    const emailFind = user.emailChild;
    return findByEmail({ ...user, email: emailFind }, (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)).then((response: ResponseI | undefined) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          setTesto(response.jsonText.numeroPunti);
          let nameImage: NameImageI[] = response.jsonText.nameImage?.map((x: string) => {
            return { name: x };
          }
          )
          nameImage = nameImage ? nameImage : [];
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
              textRight: x.usePoints + " point"
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
              title: i18n._("punti"),
              loadImage: (image: FormData) => saveImage(cardsDataId[0], image, user),
              children: renderChildren1(),
            },
            {

              _id: cardsDataId[1],
              text: cardText2,
              img: nameImage[1].name,
              title: i18n._("log_attivita"),
              loadImage: (image: FormData) => saveImage(cardsDataId[1], image, user),
              children: renderChildren2(false),
            },
            {

              _id: cardsDataId[2],
              text: cardText3,
              img: nameImage[2].name,
              title: i18n._("log_famiglia"),
              loadImage: (image: FormData) => saveImage(cardsDataId[2], image, user),
              children: renderChildren3(false),
            }
          ];
          setCardData(cardProps);
          return cardData;
        }
      }
    })
  }
  const getLogAttivita = (userI: UserI, openDialog: boolean): Promise<void> => {
    const emailFind = user.emailChild;

    const page = 0;
    const size = 5;
    const field = 'date';
    const unpaged = openDialog;
    return getLogActivityByEmail({ ...userI, email: emailFind, page, size, field, unpaged }, () => showMessage(alertConfig.setOpen, alertConfig.setMessage)).then((response: ResponseI | undefined) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          if (unpaged) {
            setTestoLogUnpaged(response.jsonText)
          } else {
            setTestoLog(response.jsonText)
          }
          setOpenDialogLogActivity(openDialog);

        }
      }
    })
  }



  const getLogFamily = (userI: UserI, openDialog: boolean): Promise<void> => {
    const emailFind = user.emailChild;
    const page = 0;
    const size = 5;
    const field = 'date';
    const unpaged = openDialog;
    return getLogFamilyByEmail({ ...userI, email: emailFind, page, size, field, unpaged }, () => showMessage(alertConfig.setOpen, alertConfig.setMessage)).then((response: ResponseI | undefined) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          if (unpaged) {
            setTestoLogFamilyUnpaged(response.jsonText)
          } else {
            setTestoLogFamily(response.jsonText)
          }
          if (!openDialog) {
            setLogCard(true)
          }
          setOpenDialogLogFamily(openDialog);
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
