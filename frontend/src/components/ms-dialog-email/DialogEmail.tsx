import { Button as ButtonMui, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';
import './DialogEmail.css'; // Importa il file CSS

interface EmailDialogProps {
  openD: boolean;
  handleCloseD: () => void;
  emailOptions: string[];
  handleEmailChange: (event: SelectChangeEvent) => void;
  handleConfirm: (simulated: any,emailUserCurrent: string) => void;
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
  return (
    <Dialog open={openD} onClose={handleCloseD} className="dialog-container">
      <DialogTitle className="dialog-title">Inserisci email del figlio</DialogTitle>
      <DialogContent>
        <InputLabel>Email</InputLabel>
        <Select
          value={email}
          onChange={(event: any) => handleEmailChange(event)}
          label="Email"
          autoWidth
          className="dialog-select" // Applicando la classe CSS
        >
          {emailOptions?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <ButtonMui onClick={handleCloseD} className="button-cancel" color="secondary">
          Annulla
        </ButtonMui>
        <ButtonMui
          onClick={() => handleConfirm(simulated, emailUserCurrent)}
          className="button-confirm"
          color="primary"
          disabled={!email} // Disabilita il pulsante se l'email è vuota
        >
          Conferma
        </ButtonMui>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEmail;
