import { Trans } from "@lingui/react";
import { Button as ButtonMui, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab } from '@mui/material'; // Importato Fab
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import './Button.css'; // Assicurati che il nome del file CSS sia corretto


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
  message: string | (() => string);
}

const Button = observer((props: { pulsanti: Pulsante[] }) => {
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('CONFERMA OPERAZIONE');

  const [currentFunction, setCurrentFunction] = useState<(() => any) | null>(null);
  const [messageTitle, setMessageTitle] = useState<string>('');


  const handleClickOpen = (funzione: (...args: any[]) => any, configDialogPulsante: configDialogPulsante) => {
    setCurrentFunction(() => funzione); // Salva la funzione corrente
    // Se message è una funzione, eseguila ora per avere il valore aggiornato
    const finalMessage = typeof configDialogPulsante.message === 'function'
      ? configDialogPulsante.message()
      : configDialogPulsante.message;
    setMessageTitle(finalMessage);
    if (configDialogPulsante.showDialog) {
      setOpen(true);
    } else {
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
    <div className="col-button-container">
      {props.pulsanti.map((button, index) => (
        <div key={index} className="col-button">
          {/* Componente Fab di MUI stilizzato col nostro CSS */}
          <Fab
            id={`button-${index}`}
            // Le classi CSS gestiranno i colori accesi e la forma
            className={button.nome === 'red' ? 'button-red' : 'button-blue'}
            title={button.title}
            onClick={() => handleClickOpen(button.funzione, button.configDialogPulsante)}
            disabled={button.disableButton}

            // MODIFICATO: size="small" per il FAB mini (40px)
            size="small"

            aria-label={button.title}
          >
            {/* L'icona sarà rimpicciolita via CSS */}
            <i className={button.icona}></i>
          </Fab>
        </div>
      ))}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ className: 'dialog-custom' }}
      >
        {/* Header dedicato */}
        <div className="dialog-header">
          <DialogTitle className='dialog-title-custom'>
            {title}
          </DialogTitle>
        </div>

        <DialogContent >
          {/* Testo avvolto da un contenitore stilizzato */}
          <div className="dialog-message-container">
            <DialogContentText className='dialog-text-custom'>
              {messageTitle || "Sei sicuro di voler procedere con questa operazione?"}
            </DialogContentText>
          </div>
        </DialogContent>

        <DialogActions className="dialog-actions-custom">
          {/* Pulsanti standard per il Dialog */}
          <ButtonMui
            onClick={handleClose}
            className="dialog-button-cancel"
          >
            <Trans id="annulla" />
          </ButtonMui>
          <ButtonMui
            onClick={handleConfirm}
            className="dialog-button-confirm"
            variant="contained"    >
            <Trans id="si_conferma" />
          </ButtonMui>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default Button;


