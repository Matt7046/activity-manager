import { Trans } from "@lingui/react";
import { Button as ButtonMui, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import React, { useState } from 'react';
import './DialogEmail.css'; // Importa il file CSS

interface EmailDialogProps {
  openD: boolean;
  handleCloseD: () => void;
  emailOptions: string[];
  handleEmailChange: (event: SelectChangeEvent) => void;
  handleConfirm: (simulated: any, emailUserCurrent: string) => void;
  email: string;
  simulated: any;
  emailUserCurrent: string;
}

const DialogEmail: React.FC<EmailDialogProps> = ({
  openD,
  handleCloseD,
  emailOptions,
  handleEmailChange,
  handleConfirm,
  email,
  simulated,
  emailUserCurrent
}) => {

  const [title, setTitle] = useState('SCEGLI EMAIL DEL TUTORATO');
return (
    <Dialog 
      open={openD} 
      onClose={handleCloseD} 
      PaperProps={{ className: "dialog-custom" }}
    >
      {/* Sezione Header */}
      <div className="dialog-header">
        <DialogTitle className="dialog-title-custom">
          <Trans id="configurazione_tutorato" />
        </DialogTitle>
      </div>

      <DialogContent className="dialog-body" >
        {/* Box Istruzioni */}
        <div className="instruction-box">
          <Typography className="instruction-text">
            <Trans id="seleziona_lindirizzo_email_del_tutorato_per_procedere_con_lassegnazione" />
          </Typography>
        </div>

        {/* Form Field */}
        <InputLabel sx={{ ml: 1, fontSize: '0.85rem', fontWeight: 600, color: '#4b5563' }}>
          <Trans id="indirizzo_email" />
        </InputLabel>
        <Select
          value={email}
          onChange={(event: any) => handleEmailChange(event)}
          fullWidth
          className="dialog-select-custom"
          displayEmpty
        >
          {emailOptions?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>

      <DialogActions className="dialog-actions-custom">
        <ButtonMui 
          onClick={handleCloseD} 
          className="button-cancel-custom"
        >
          <Trans id="annulla" />
        </ButtonMui>
        <ButtonMui
          onClick={() => handleConfirm(simulated, emailUserCurrent)}
          className="button-confirm-custom"
          variant="contained"
          disabled={!email}
        >
          <Trans id="conferma_scelta" />
        </ButtonMui>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEmail;
