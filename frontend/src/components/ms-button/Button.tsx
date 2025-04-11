import { Button as ButtonMui, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';

export interface Pulsante {
  icona: string;
  nome: string;
  funzione: (...args: any[]) => any;
  title: string;
  visibility?: boolean;
  disableButton?: boolean;
  configDialogPulsante: configDialogPulsante;
}

export interface configDialogPulsante {
  showDialog: boolean;
  message: string;
}

const Button = observer((props: { pulsanti: Pulsante[] }) => {
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [open, setOpen] = useState(false);
  const [currentFunction, setCurrentFunction] = useState<(() => any) | null>(null);
  const [messageTitle, setMessageTitle] = useState<string>('');


  const handleClickOpen = (funzione: (...args: any[]) => any, configDialogPulsante: configDialogPulsante) => {
    setCurrentFunction(() => funzione); // Salva la funzione corrente
    setMessageTitle(configDialogPulsante.message);
    if (configDialogPulsante.showDialog) {
      setOpen(true);
    }else{
      funzione();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentFunction(null); // Resetta la funzione corrente
  };

  const handleConfirm = () => {
    if (currentFunction) currentFunction(); // Esegui la funzione salvata
    setOpen(false);
    setCurrentFunction(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="col-button-container"
      style={{
        display: 'flex',
        gap: '12px',
      }}
    >
      {props.pulsanti.map((button, index) => (
        <div key={index} className="col-button">
          <ButtonMui 
            id={`button-${index}`}
            className={button.nome === 'red' ? 'button-red' : 'button-blue'}
            title={button.title}
            onClick={() => handleClickOpen(button.funzione, button.configDialogPulsante)} // Apri il dialog con la funzione specifica
            sx={{
              opacity: button.disableButton ? 0.3 : 1,
              pointerEvents: button.disableButton ? 'none' : 'auto',
              cursor: button.disableButton ? 'not-allowed' : 'pointer',
              border: button.disableButton ? '1px solid lightgrey' : 'initial',
              color: '#000',  // Colore nero  
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: button.nome === 'red' ? '#ef4444' : '#4338ca',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
              },
            }}         
          >
            <i className={button.icona}></i>
          </ButtonMui>
        </div>
      ))}
      <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          opacity: 1,
          pointerEvents: 'auto',
          cursor: 'pointer',
          border: 'initial',
          color: '#fff',  // Puoi cambiare questo con il colore che preferisci
          borderRadius: '50px',
          backgroundColor: '#d1d1d1', // Impostato il colore di sfondo a un grigio scuro
        },
      }}
    >
<DialogTitle sx={{ color: '#000000' }}>Conferma azione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {messageTitle}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonMui onClick={handleClose} color="secondary">
            Annulla
          </ButtonMui>
          <ButtonMui onClick={handleConfirm} color="primary">
            Conferma
          </ButtonMui>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default Button;
