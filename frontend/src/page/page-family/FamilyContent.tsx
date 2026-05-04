"use client";
import { useUser } from '@/context/UserContext';
import { Trans, useLingui } from "@lingui/react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from "react";
import { AlertConfig } from '../../components/ms-alert/Alert';
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, HttpStatus } from '../../general/structure/Constant';
import { FormErrorValues, ResponseI, verifyForm } from "../../general/structure/Utils";
import { showMessage } from "../page-home/HomeContent";
import { findByEmail } from "../page-user-point/service/UserPointService";
import "./FamilyContent.css";
import { savePointsByFamily } from './service/FamilyService';
import familyStore from './store/FamilyStore';

interface FamilyContentProps {
  alertConfig: AlertConfig;
  isVertical: boolean;
}

const FamilyContent: React.FC<FamilyContentProps> = ({
  alertConfig,
  isVertical
}) => {
  const { user } = useUser();
  const { i18n } = useLingui();
  
  type FormValues = {
    [key: string]: number | undefined;
  };

  const [disableButtonSave, setDisableButtonSave] = useState(true);
  const [formValues, setFormValues] = useState<FormValues>({
    newPoints: 0,
  });

  const [isPlusIcon, setIsPlusIcon] = useState(true);
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);

  const toggleIcon = () => {
    setIsPlusIcon((prev) => !prev);
  };

  useEffect(() => {
    const emailFind = user.emailChild;

    findByEmail({ ...user, email: emailFind }, (message: any) => 
      showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
    ).then((response: ResponseI | undefined) => {
      if (response && response.status === HttpStatus.OK) {
        familyStore.setPoints(response.jsonText.points);
        familyStore.setEmail(user.email);
        const errors: FormErrorValues = verifyForm(formValues);
        setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0);
      }
    });
  }, [inizialLoad]);

  useEffect(() => {
    const errors: FormErrorValues = verifyForm(formValues);
    setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0);
  }, [formValues]);

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-solid fa-floppy-disk',
    funzione: () => salvaRecord(user),
    nome: ButtonName.BLUE,
    disableButton: disableButtonSave,
    title: i18n._("salva"),
    configDialogPulsante: { 
      message: isPlusIcon ? i18n._("vuoi_aggiungere_punti") : i18n._("vuoi_sottrarre_punti"), 
      showDialog: true 
    }
  };

  const salvaRecord = (userData: any): Promise<any> => {
    const pointsWithPlus = isPlusIcon ? formValues.newPoints : - (formValues.newPoints || 0);
    const dataToSend = { ...userData, email: user.emailChild, usePoints: pointsWithPlus };
    
    return savePointsByFamily(dataToSend, (message: any) => 
      showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
    ).then((x) => {
      if (x?.jsonText?.points !== undefined) {
        familyStore.setPoints(parseInt(x.jsonText.points));
      }
    });
  };

  return (
    <Box className='box-family-content'>
      <Grid container spacing={2}>
        {/* Titolo con email - TESTO RICHIESTO AGGIUNTO QUI */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" color="text.secondary">
            <Trans id="operazioni_famiglia" /> <strong>{user?.emailUserCurrent}</strong>
          </Typography>
        </Grid>

        {/* Prima riga: Email (Disabilitata) e Punti Attuali */}
        <Grid size={{ xs: 12, sm: 6 }}>
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

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl className="form-control-family" variant="standard" fullWidth>
            <InputLabel htmlFor="points-current">{i18n._("punti")}</InputLabel>
            <Input
              id="points-current"
              value={familyStore.getStore().points}
              disabled={true}
            />
          </FormControl>
        </Grid>

        {/* Seconda riga: Input Nuovi Punti con Toggle Icon */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth variant="standard" className="form-control-family">
            <InputLabel htmlFor="new-points-input">{i18n._("nuovi_punti")}</InputLabel>
            <Input
              id="new-points-input"
              value={formValues.newPoints}
              onChange={(e) => setFormValues({ ...formValues, newPoints: parseInt(e.target.value) || 0 })}
              type="number"
              startAdornment={
                <InputAdornment position="start">
                  <IconButton
                    aria-label={i18n._("add_punti")}
                    onClick={toggleIcon}
                    edge="end"
                  >
                    {isPlusIcon ? <AddIcon color="primary" /> : <RemoveIcon color="error" />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
      </Grid>

      {/* Pulsante Salva - Allineato a destra come Operative */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button pulsanti={[pulsanteBlue]} />
      </Box>
    </Box>
  );
};

export default FamilyContent;