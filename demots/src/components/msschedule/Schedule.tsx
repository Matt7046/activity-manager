import { Alert, Grid, Snackbar } from '@mui/material';
import { observer } from 'mobx-react';
import NameDisplay from '../msnamedisplay/NameDisplay';
import Label from '../mslabel/label';
import Button, { Pulsante } from '../msbutton/Button';
import { myDisplayer } from '../../general/Utils';


export interface MsSchedule {

  icona: string
  nome: string
  funzione: any,
  title: string,
  visibility?: boolean
}


const Schedule = observer((props: {
  justifyContent?: string;
  onClose: any;
  handleClose: any;
  identificativo: string;
  titleLabel: string;
  subTitleLabel: string;
  errors: any;
  visibilityButton: boolean;
  open: any;
  pulsanti: Pulsante[];
}) => {
  const visibilityButton = props.visibilityButton ?? true;

  return (
    <>
      <div className="row">
        <Snackbar
          open={props.open}
          autoHideDuration={6000} // Chiude automaticamente dopo 6 secondi
          onClose={props.handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Posizione del messaggio
        >
          <Alert onClose={props.onClose} severity="error" sx={{ width: '100%' }}>
            -{props.errors}
          </Alert>
        </Snackbar>

        <div className="col-display">
          <NameDisplay value={props.titleLabel} identificativo={props.identificativo} />
        </div>

        <Grid container justifyContent={props.justifyContent} spacing={2} style={{ height: '30px' }}>
          <Grid item>
            <div>
              <Button visibilityButton={visibilityButton} pulsanti={props.pulsanti} />
            </div>
          </Grid>
        </Grid>

        <div
          id={`rowHidden-${props.identificativo}`}
          style={{ gridColumn: 'span 12', visibility: 'hidden' }}
        >
          <Label _id={props.identificativo} text={props.subTitleLabel} />
        </div>

        <hr className="custom-separator" /> {/* Stile con classe */}
      </div>
    </>
  );
});

export const aggiornaDOMComponente = (responseNome: any[], setVisibilityButton: any): any => {
  if (responseNome) {
    for (let index = 0; index < responseNome.length; index++) {
      myDisplayer("displayer-" + responseNome[index]._id, responseNome[index].nome);
      setVisibilityButton(true);
    }
  }
}


export default Schedule;