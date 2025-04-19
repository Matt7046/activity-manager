import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { observer } from 'mobx-react';
import * as React from 'react';
import './Drawer.css';


type Anchor = 'top' | 'left' | 'bottom' | 'right';

export interface MenuLaterale {
  funzione: ((...args: unknown[]) => unknown) | null; // Può essere una funzione o `null`
  testo: string
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>
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
          <Button
            className="drawer-toggle-button"

            onClick={toggleDrawer(anchor, true, setStatoComponente, statoComponente)}>{props.nameMenu}
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





const listaItem = (anchor: Anchor, sezioni: MenuLaterale[][], setStatoComponente: React.Dispatch<React.SetStateAction<TypeAnchor>>, statoComponente: TypeAnchor) => (
  <Box
    className={`drawer-box ${anchor === 'top' || anchor === 'bottom' ? 'drawer-horizontal' : 'drawer-vertical'}`}

    role="presentation"
    onClick={toggleDrawer(anchor, false, setStatoComponente, statoComponente)}
    onKeyDown={toggleDrawer(anchor, false, setStatoComponente, statoComponente)}
  >
    <>
      {sezioni.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <List>
            {section.map((menulaterale, index) => (
              <ListItem key={menulaterale.testo} disablePadding>
                <ListItemButton
                  className="drawer-list-item"
                  onClick={() => {
                    if (menulaterale.funzione) {
                      menulaterale.funzione(); // Chiama la funzione associata a questo elemento
                    }
                  }}
                >
                  <ListItemIcon className="drawer-list-icon">
                  {menulaterale.icon && <menulaterale.icon />} {/* Usa l'icona dinamica */}
                  </ListItemIcon>
                  <ListItemText primary={menulaterale.testo} />
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