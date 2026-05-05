"use client";
import { Trans, useLingui } from "@lingui/react";
import { Box, FormControl, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from "react";
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, HttpStatus, SectionName, TypeUser } from "../../general/structure/Constant";
import { FormErrorValues, UserI, verifyForm } from "../../general/structure/Utils";
import { deleteAboutById, saveActivity, showMessageAboutForm } from "../page-activity/service/ActivityService";
import activityStore from "../page-activity/store/ActivityStore";
import { navigateRouting, showMessage } from "../page-home/HomeContent";
import { TypeMessage } from "../page-layout/PageLayout";
import "./AboutContent.css";




interface AboutContentProps {
  user: UserI;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isVertical: boolean;
}

const AboutContent: React.FC<AboutContentProps> = ({
  user,
  setMessage,
  setOpen,
  isVertical
}) => {

  const pathname = usePathname();
  const router = useRouter(); // Ottieni la funzione di navigazione
  const { i18n } = useLingui();
  const [disableButtonSave, setDisableButtonSave] = useState<boolean>();
  const searchParams = useSearchParams();
  const _id = searchParams.get('_id');
  const [disableButtonDelete, setDisableButtonDelete] = useState<boolean>(_id === null || _id === undefined);
  const [subTesto, setSubTesto] = useState(activityStore.activity.find((x) => _id === x._id)?.subTesto);

  // Stato per i valori dei campi
  type FormValues = {
    [key: string]: string | number | undefined;
  };


  const [formValues, setFormValues] = useState<FormValues>({
    activity: activityStore.activity.find((x) => _id === x._id)?.nome,
    points: activityStore.activity.find((x) => _id === x._id)?.points,
  });

  const [formErrors, setFormErrors] = useState<FormErrorValues>({
    activity: true,
    points: true,
  });

  // Effetto per catturare i cambiamenti di formValues
  useEffect(() => {
    const errors: FormErrorValues = verifyForm(formValues);
    setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0)
    // Puoi aggiungere altre azioni da eseguire quando formValues cambia
  }, [formValues]); // Dipendenza su formValues


  const handleButtonClick = () => {
    const errors: FormErrorValues = verifyForm(formValues);
    setFormErrors(errors);

    // Procedi solo se non ci sono errori
    if (Object.keys(errors).filter((key) => errors[key] === true).length === 0) {
      salvaRecord(_id); // Chiama la funzione per salvare i dati
    } else {
      const erroriCampi = Object.keys(formErrors).filter((key) => errors[key] === true);
      let errorFields: string[] = [];
      if (erroriCampi.length > 0) {
        errorFields = ["I valori invalidi sono:"].concat(erroriCampi);

      }
      showMessageAboutForm((message?: TypeMessage) => showMessage(setOpen, setMessage, { ...message, message: errorFields }));
    }
  };




  const pulsanteRed: Pulsante = {
    icona: 'fas fa-solid fa-trash',
    funzione: () => cancellaRecord(_id), // Passi la funzione direttamente
    disableButton: disableButtonDelete,
    nome: ButtonName.RED,
    title: i18n._("elimina"),
    visibility: _id ? true : false,
    configDialogPulsante: { message: i18n._("vuoi_eliminare_il_record"), showDialog: true }

  };

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-solid fa-floppy-disk',
    funzione: () => handleButtonClick(), // Passi la funzione direttamente
    disableButton: disableButtonSave,
    nome: ButtonName.BLUE,
    title: i18n._("salva"),
    configDialogPulsante: { message: i18n._("confermi_loperazione"), showDialog: true }

  };

  const pulsanteReturn: Pulsante = {
    icona: 'fas fa-arrow-left',
    funzione: () => returnActivity(), // Passi la funzione direttamente
    //disableButton: disableButtonSave,
    nome: ButtonName.BACK,
    title: i18n._("ritorna"),
    configDialogPulsante: { message: '', showDialog: false }

  };

  const handleChangeActivity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, activity: event.target.value })
    // setActivity(event.target.value); // Aggiorna lo stato con il valore inserito
  };

  const handleChangePoints = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, points: parseInt(event.target.value) })
    //setPoints(parseInt(event.target.value)); // Aggiorna lo stato con il valore inserito
  };

  const handleChangeSubTesto = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubTesto(event.target.value); // Aggiorna lo stato con il valore inserito    
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
  };

  const handleChangeEmailFamily = (event: React.ChangeEvent<HTMLInputElement>) => {
  };


  const handleClose = () => {
    setOpen(false);
  };

  // Crea l'array dei pulsanti in base all'orientamento

  const cancellaRecord = (_id: string | null): void => {

    deleteAboutById(_id, (message?: TypeMessage) => showMessage(setOpen, setMessage, message)).then((response) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          navigateRouting(router, SectionName.ACTIVITY, {})
        }
      }
    })
  }
  const returnActivity = (): void => {
    navigateRouting(router, SectionName.ACTIVITY, {})
  }

  const salvaRecord = (_id: string | null): void => {
    const emailFind = user.emailChild ? user.emailChild : user.email;
    const testo = {
      ...user,
      _id: _id,
      nome: formValues.activity,
      subTesto: subTesto,
      points: formValues.points,
      email: emailFind
    }
    saveActivity(testo, (message?: TypeMessage) => showMessage(setOpen, setMessage, message)).then((response) => {
      if (response?.jsonText) {
        setDisableButtonDelete(false);
        navigateRouting(router, SectionName.ACTIVITY, {})
      }
    })
  }

  return (
    <Box className='box-about'>
      <Grid container spacing={3}>
        {/* Intestazione */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" color="text.secondary">
            {user?.type === TypeUser.FAMILY ? (
              <Trans id="dettaglio_attivita" />
            ) : (
              <Trans id="dettaglio_attivita_child" />
            )} <strong>{user?.emailUserCurrent}</strong>
          </Typography>
        </Grid>

        {/* Email sola lettura */}
        <Grid size={{ xs: 6 }}>
          <FormControl fullWidth>
            <TextField
              label={i18n._("email")}
              value={user?.emailChild}
              fullWidth
              margin="normal"
              disabled={true}
            />
          </FormControl>
        </Grid>

        {/* Riga Attività e Punti */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            id="activity"
            label={i18n._("attivita")}
            variant="standard"
            value={formValues.activity}
            onChange={handleChangeActivity}
            disabled={user?.type === TypeUser.STANDARD}

            fullWidth
            required={true}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label={i18n._("punti")}
            variant="standard"
            type="number"
            value={formValues.points}
            onChange={handleChangePoints}
            fullWidth
            disabled={user?.type === TypeUser.STANDARD}
            required
          />
        </Grid>

        {/* Descrizione Multiline */}
        <Grid size={{ xs: 12 }}>
          <TextField
            label={i18n._("descrizione")}
            variant="standard"
            value={subTesto}
            onChange={handleChangeSubTesto} // Aggiorna lo stato quando cambia
            fullWidth
            multiline
            rows={10}
          />
        </Grid>

        <Box className="about-action-row">
          <Box>
            <Button pulsanti={[pulsanteReturn]} />
          </Box>
          <Box display="flex" gap={1}>
            <Button pulsanti={[pulsanteRed, pulsanteBlue]} />
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};
export default AboutContent;
