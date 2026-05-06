"use client";
import { useLingui } from "@lingui/react";
import { Box } from "@mui/material";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { AlertConfig } from '../../components/ms-alert/Alert';
import Button, { Pulsante } from "../../components/ms-button/Button";
import CardGrid, { CardProps, CardText } from "../../components/ms-card/Card";
import { upload } from '../../general/service/ImageService';
import { ButtonName, HttpStatus } from "../../general/structure/Constant";
import { getDateStringRegularFormat, navigateRouting, ResponseI, showMessage, UserI } from "../../general/structure/Utils";
import { ActivityLogI } from "../page-activity/Activity";
import { getLogActivityByEmail } from "../page-activity/service/LogActivityService";
import { FamilyLogI } from "../page-family/Family";
import { getLogFamilyByEmail } from "../page-family/service/FamilyService";
import { findByEmail, saveUserImage } from "./service/UserPointService";
import { NameImageI, UserPointsI } from './UserPoint';
import "./UserPointContent.css";

interface PointsContentProps {
  user: UserI;
  alertConfig: AlertConfig;
  isVertical: boolean;
}

const UserPointContent: React.FC<PointsContentProps> = ({
  user,
  alertConfig,
  isVertical
}) => {
  const router = useRouter();
  const { i18n } = useLingui();

  // Stati mantenuti come da richiesta per non rompere logiche esterne
  const [openDialogLogFamily, setOpenDialogLogFamily] = useState(false);
  const [openDialogLogActivity, setOpenDialogLogActivity] = useState(false);
  const [testoLog, setTestoLog] = useState<ActivityLogI[]>([]);
  const [testoLogFamily, setTestoLogFamily] = useState<FamilyLogI[]>([]);
  const [testoLogUnpaged, setTestoLogUnpaged] = useState<ActivityLogI[]>([]);
  const [testoLogFamilyUnpaged, setTestoLogFamilyUnpaged] = useState<FamilyLogI[]>([]);
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);
  const [logCard, setLogCard] = useState<boolean>(false);
  const [cardData, setCardData] = useState<CardProps[]>([]);
  const [changePoint, setChangePoint] = useState<boolean>(false);
  const [nameImage, setNameImage] = useState<NameImageI[]>([]);
  const cardsDataId: string[] = ["userPointCard1", "userPointCard2", "userPointCard3"];

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

  const pulsanteLog: Pulsante = {
    icona: 'fas fa-history',
    funzione: () => {
      setOpenDialogLogActivity(true);
      navigateRouting(router, "log-user-point", { "type": "activity" })
    },
    nome: ButtonName.BLUE,
    title: i18n._("log_attivita"),
    visibility: !!user,
    configDialogPulsante: { message: '', showDialog: false }
  };

  const pulsanteLogFamily: Pulsante = {
    icona: 'fas fa-history',
    funzione: () => {
      setOpenDialogLogFamily(true);
      navigateRouting(router, "log-user-point", { "type": "family" })
    },
    nome: ButtonName.BLUE,
    title: i18n._("log_family"),
    visibility: !!user,
    configDialogPulsante: { message: '', showDialog: false }
  };

  const saveImage = (_id: string, image: FormData, userPoint: UserPointsI): Promise<string> => {
    return upload(image, () => showMessage(alertConfig.setOpen, alertConfig.setMessage)).then((response) => {
      const url = response?.jsonText.url;
      const fileName = url.substring(url.lastIndexOf('upload/'));
      const payload = { ...userPoint, nameImage: fileName, email: user.emailChild };
      return saveUserImage(payload, () => showMessage(alertConfig.setOpen, alertConfig.setMessage)).then(() => {
        setChangePoint(!changePoint);
        return fileName;
      });
    });
  };

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

  const renderChildren1 = () => (
    <React.Fragment>
      <Button pulsanti={[]} />
    </React.Fragment>
  )


  const renderChildren2 = () => (
    <React.Fragment>
      <Button pulsanti={[pulsanteLog]} />
    </React.Fragment>
  )


  const renderChildren3 = () => (
    <React.Fragment>
      <Button pulsanti={[pulsanteLogFamily]} />
    </React.Fragment>
  )

  const getPoints = (): Promise<CardProps[] | undefined> => {
    const emailFind = user.emailChild;
    return findByEmail({ ...user, email: emailFind }, (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)).then((response: ResponseI | undefined) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
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

          const CardTextAlign: any = {
            textLeft: i18n._("numero_punti") + response.jsonText.points
          }

          const textAlign1: any[] = [CardTextAlign]

          const cardText1: CardText = {
            textLeftTitle: i18n._("descrizione"),
            text: textAlign1
          }

          const textAlign2: any[] = testoLog.map((x) => {

            return {

              textLeft: x.log,
              textRight: (-x.usePoints).toString()
            }
          });

          const cardText2: CardText = {
            textLeftTitle: i18n._("attivita"),
            textRightTitle: i18n._("variazione_punti"),
            text: textAlign2
          }

          const textAlign3: any[] = testoLogFamily.map((x) => {
            return {
              textLeft: getDateStringRegularFormat(x.date),
              textRight: x.operations
            }
          });

          const cardText3: CardText = {
            textLeftTitle: i18n._("data"),
            textRightTitle: i18n._("operazione"),
            text: textAlign3
          }

          const cardProps: CardProps[] = [
            {
              _id: cardsDataId[0],
              text: cardText1,
              img: nameImage[0].name,
              title: i18n._("punti_caps_lock"),
              loadImage: (image: FormData) => saveImage(cardsDataId[0], image, user),
              children: renderChildren1(),
            },
            {

              _id: cardsDataId[1],
              text: cardText2,
              img: nameImage[1].name,
              title: i18n._("log_attivita"),
              loadImage: (image: FormData) => saveImage(cardsDataId[1], image, user),
              children: renderChildren2(),
            },
            {

              _id: cardsDataId[2],
              text: cardText3,
              img: nameImage[2].name,
              title: i18n._("log_famiglia"),
              loadImage: (image: FormData) => saveImage(cardsDataId[2], image, user),
              children: renderChildren3(),
            }
          ];
          setCardData(cardProps);
          return cardData;
        }
      }
    })
  }

  return (
    <div className="row custom-padding">
      <Box id="cardData">
        <CardGrid cardsData={cardData} />
      </Box>
    </div>
  );
};

export default UserPointContent;