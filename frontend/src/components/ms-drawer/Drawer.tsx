import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { observer } from 'mobx-react';
import * as React from 'react';


type Anchor = 'top' | 'left' | 'bottom' | 'right';

export interface MenuLaterale {
  funzione: ((...args: unknown[]) => unknown) | null; // Può essere una funzione o `null`
  testo: string
}

export interface TypeAnchor {
  top: boolean,
  left: boolean,
  bottom: boolean,
  right: boolean
}

const Drawer = observer((props: {
  //key: number;
  sezioni: MenuLaterale[][];
  nameMenu: string;
  route?: string;
  anchor: Anchor
}) => {

  const typeAnchor: TypeAnchor = {
    top: false,
    left: false,
    bottom: false,
    right: false,
  }

  const [statoComponente, setStatoComponente] = React.useState<TypeAnchor>(typeAnchor);

  return (
    <div>
      {[props.anchor].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true, setStatoComponente, statoComponente)}>{props.nameMenu}
          </Button>
          <SwipeableDrawer
            anchor={anchor}
            open={statoComponente[anchor]}
            onClose={toggleDrawer(anchor, false, setStatoComponente, statoComponente)}
            onOpen={toggleDrawer(anchor, true, setStatoComponente, statoComponente)}
          >
            {listaItem(anchor, props.sezioni, setStatoComponente, statoComponente)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
})

const toggleDrawer = (
  anchor: keyof TypeAnchor, // Specifica che "anchor" deve essere una delle chiavi di TypeAnchor
  open: boolean,
  setStatoComponente: React.Dispatch<React.SetStateAction<TypeAnchor>>, // Tipo corretto per il setter dello stato
  statoComponente: TypeAnchor
) => 
(event: React.KeyboardEvent | React.MouseEvent) => {
  if (
    event.type === 'keydown' &&
    ((event as React.KeyboardEvent).key === 'Tab' || 
     (event as React.KeyboardEvent).key === 'Shift')
  ) {
    return; // Se è un evento di tastiera con i tasti "Tab" o "Shift", esci senza fare nulla
  }

  setStatoComponente({ ...statoComponente, [anchor]: open }); // Aggiorna lo stato con il nuovo valore
};





const listaItem = (anchor: Anchor, sezioni: MenuLaterale[][], setStatoComponente:React.Dispatch<React.SetStateAction<TypeAnchor>>, statoComponente: TypeAnchor) => (
  <Box
    sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
    role="presentation"
    onClick={toggleDrawer(anchor, false, setStatoComponente, statoComponente)}
    onKeyDown={toggleDrawer(anchor, false, setStatoComponente, statoComponente)}
  >
    <>
      {sezioni.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <List>
            {section.map((text, index) => (
              <ListItem key={text.testo} disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (text.funzione) {
                      text.funzione(); // Chiama la funzione associata a questo elemento
                    }
                  }}
                >
                  <ListItemIcon>
                    {(sectionIndex * section.length + index) % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text.testo} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {sectionIndex !== sezioni.length - 1 && <Divider />} {/* Divider tra le sezioni */}
        </div>
      ))}
    </>
  </Box>
);


export default Drawer;