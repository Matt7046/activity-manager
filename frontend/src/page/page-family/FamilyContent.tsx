"use client";
import { useUser } from '@/context/UserContext';
import { Trans, useLingui } from "@lingui/react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React, { useEffect, useMemo, useState } from "react";
import { AlertConfig } from '../../components/ms-alert/Alert';
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, HttpStatus, TypeAlertColor } from '../../general/structure/Constant';
import { FormErrorValues, ResponseI, showMessage, verifyForm } from "../../general/structure/Utils";
import { PointRegister } from "../page-register/RegisterContent";
import { findByEmail, getEmailChild } from "../page-user-point/service/UserPointService";
import "./FamilyContent.css";
import { savePointsByFamily, updateChildrenByFamily } from './service/FamilyService';
import familyStore from './store/FamilyStore';

interface FamilyContentProps {
  alertConfig: AlertConfig;
  isVertical: boolean;
}

const FamilyContent: React.FC<FamilyContentProps> = ({
  alertConfig,
  isVertical: _isVertical
}) => {
  const { user } = useUser();
  const { i18n } = useLingui();

  type FormValues = {
    newPoints: string;
  };

  const [disableButtonSave, setDisableButtonSave] = useState(true);
  const [formValues, setFormValues] = useState<FormValues>({
    newPoints: '0',
  });

  const [isPlusIcon, setIsPlusIcon] = useState(true);
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);

  const [childRows, setChildRows] = useState<PointRegister[]>([]);
  const [baselineEmails, setBaselineEmails] = useState<string[]>([]);

  const toggleIcon = () => {
    setIsPlusIcon((prev) => !prev);
  };

  const applyEmailFigliResponse = (emailFigli: string[] | undefined) => {
    const list = emailFigli ?? [];
    const trimmed = list.map((e) => String(e).trim()).filter((e) => e.length > 0);
    setChildRows(trimmed.map((email) => ({ email, password: '' })));
    setBaselineEmails([...trimmed]);
  };

  const loadFigli = (): Promise<ResponseI | undefined> => {
    if (!user?.emailUserCurrent) {
      return Promise.resolve(undefined);
    }
    return getEmailChild(
      { ...user, email: user.emailChild },
      (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message),
    ).then((res) => {
      if (res?.status === HttpStatus.OK) {
        applyEmailFigliResponse(res?.jsonText?.emailFigli as string[] | undefined);
      }
      return res;
    });
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
    if (!user?.emailUserCurrent) {
      return;
    }
    void loadFigli();
  }, [user?.emailUserCurrent, user?.emailChild]);

  useEffect(() => {
    const errors: FormErrorValues = verifyForm(formValues);
    setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0);
  }, [formValues]);

  const normalizedDesired = useMemo(
    () =>
      childRows
        .map((r) => r.email.trim())
        .filter((e) => e.length > 0)
        .sort()
        .join('|'),
    [childRows],
  );

  const normalizedBaseline = useMemo(
    () =>
      baselineEmails
        .map((e) => e.trim())
        .filter((e) => e.length > 0)
        .sort()
        .join('|'),
    [baselineEmails],
  );

  const hasChildChanges = normalizedDesired !== normalizedBaseline;

  const handleChangeEmailFiglio = (index: number, value: string) => {
    const next = [...childRows];
    next[index] = { ...next[index], email: value };
    setChildRows(next);
  };

  const addFiglioRow = () => {
    setChildRows([...childRows, { email: '', password: '' }]);
  };

  const removeFiglioRow = (index: number) => {
    setChildRows((prev) => prev.filter((_, i) => i !== index));
  };

  const salvaFigli = (): Promise<ResponseI | undefined> => {
    const desired = childRows.map((r) => r.email.trim()).filter((e) => e.length > 0);
    if (new Set(desired).size !== desired.length) {
      showMessage(alertConfig.setOpen, alertConfig.setMessage, {
        titleMessage: i18n._("conferma_operazione"),
        typeMessage: TypeAlertColor.ERROR,
        message: [i18n._("email_duplicate_figli")],
      });
      return Promise.resolve(undefined);
    }
    const desiredSet = new Set(desired);
    const baseSet = new Set(baselineEmails.map((e) => e.trim()).filter(Boolean));
    const ops: { email: string; operation: boolean }[] = [];
    baselineEmails.forEach((e) => {
      const t = e.trim();
      if (t.length > 0 && !desiredSet.has(t)) {
        ops.push({ email: t, operation: false });
      }
    });
    desired.forEach((e) => {
      if (!baseSet.has(e)) {
        ops.push({ email: e, operation: true });
      }
    });
    if (ops.length === 0) {
      return Promise.resolve(undefined);
    }
    return updateChildrenByFamily(
      { userPoint: { emailUserCurrent: user.emailUserCurrent }, userPointChild: ops },
      (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message),
      undefined,
      true,
    ).then((res) => {
      if (res?.status === HttpStatus.OK && res?.jsonText?.emailFigli) {
        applyEmailFigliResponse(res.jsonText.emailFigli as string[]);
      }
      return res;
    });
  };

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-circle-check',
    funzione: () => salvaRecord(user),
    nome: ButtonName.BLUE,
    disableButton: disableButtonSave,
    title: i18n._("salva"),
    configDialogPulsante: {
      message: isPlusIcon ? i18n._("vuoi_aggiungere_punti") : i18n._("vuoi_sottrarre_punti"),
      showDialog: true
    }
  };

  const pulsanteNewFiglio: Pulsante = {
    icona: 'fas fa-plus',
    funzione: () => addFiglioRow(),
    nome: ButtonName.NEW,
    title: i18n._("nuovo_tutorato"),
    configDialogPulsante: { message: i18n._("vuoi_aggiungere_un_tutorato"), showDialog: true }
  };

  const pulsanteSalvaFigli: Pulsante = {
    icona: 'fas fa-circle-check',
    funzione: () => salvaFigli(),
    nome: ButtonName.RED,
    disableButton: !hasChildChanges,
    title: i18n._("salva"),
    configDialogPulsante: { message: i18n._("vuoi_salvare"), showDialog: true }
  };

  const salvaRecord = (userData: any): Promise<any> => {
    const n = parseInt(formValues.newPoints, 10);
    const amount = Number.isFinite(n) && !Number.isNaN(n) ? n : 0;
    const pointsWithPlus = isPlusIcon ? amount : -amount;
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
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" color="text.secondary">
            <Trans id="operazioni_famiglia" /> <strong>{user?.emailUserCurrent}</strong>
          </Typography>
        </Grid>
      </Grid>

      <Box className="family-section-card">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <TextField
                label={i18n._("email")}
                value={user?.emailChild ?? "" }
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

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth variant="standard" className="form-control-family">
              <InputLabel htmlFor="new-points-input">{i18n._("nuovi_punti")}</InputLabel>
              <Input
                id="new-points-input"
                value={formValues.newPoints}
                onChange={(e) => setFormValues({ ...formValues, newPoints: e.target.value })}
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

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button pulsanti={[pulsanteBlue]} />
        </Box>
      </Box>

      <Box className="family-section-card">
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong><Trans id="email_figli" /></strong>
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box>
          {childRows.map((row, index) => (
            <Box key={index} className="family-child-row" mb={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label={`${i18n._("email")} ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    value={row.email}
                    onChange={(e) => handleChangeEmailFiglio(index, e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              aria-label={i18n._("remove")}
                              onClick={() => removeFiglioRow(index)}
                              edge="start"
                            >
                              <RemoveIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
        <Grid container justifyContent="flex-end" spacing={2} mt={1}>
          <Button pulsanti={[pulsanteNewFiglio]} />
          <Button pulsanti={[pulsanteSalvaFigli]} />
        </Grid>
      </Box>
    </Box>
  );
};

export default FamilyContent;
