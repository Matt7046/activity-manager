import { Trans } from "@lingui/react";
import MenuIcon from '@mui/icons-material/Menu';
import { Typography } from '@mui/material';
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
  funzione?: ((...args: unknown[]) => unknown) | null; // Può essere una funzione o `null`
  testo: string
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>
}

export interface TypeAnchor {
  top: boolean,
  left: boolean,
  bottom: boolean,
  right: boolean
}

const Drawer = observer((props: {
  sezioni: MenuLaterale[][];
  nameMenu: string;
  route?: string;
  anchor: Anchor;
}) => {
  const [statoComponente, setStatoComponente] = React.useState<TypeAnchor>({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  return (
    <div>
      <Button
        className="drawer-toggle-button"
        onClick={toggleDrawer(props.anchor, true, setStatoComponente, statoComponente)}
      >
        <MenuIcon /> {/* Sostituito il testo con l'icona per coerenza grafica */}
      </Button>

      <SwipeableDrawer
        anchor={props.anchor}
        open={statoComponente[props.anchor]}
        onClose={toggleDrawer(props.anchor, false, setStatoComponente, statoComponente)}
        onOpen={toggleDrawer(props.anchor, true, setStatoComponente, statoComponente)}
        PaperProps={{
          sx: { elevation: 0 } // Rimuove l'ombra pesante di default
        }}
      >
        {listaItem(props.anchor, props.sezioni, setStatoComponente, statoComponente)}
      </SwipeableDrawer>
    </div>
  );
});

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





const listaItem = (
  anchor: Anchor,
  sezioni: MenuLaterale[][],
  setStatoComponente: React.Dispatch<React.SetStateAction<TypeAnchor>>,
  statoComponente: TypeAnchor
) => (
  <Box
    className={`drawer-box ${anchor === 'top' || anchor === 'bottom' ? 'drawer-horizontal' : 'drawer-vertical'}`}
    role="presentation"
    onClick={toggleDrawer(anchor, false, setStatoComponente, statoComponente)}
    onKeyDown={toggleDrawer(anchor, false, setStatoComponente, statoComponente)}
  >
    {/* Header opzionale del menu */}
    <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
        <Trans id="menu_navigazione" />
      </Typography>
    </Box>

    {sezioni.map((section, sectionIndex) => (
      <React.Fragment key={sectionIndex}>
        <List sx={{ pt: 1, pb: 1 }}>
          {section.map((menulaterale) => (
            <ListItem key={menulaterale.testo} disablePadding>
              <ListItemButton
                className="drawer-list-item"
                onClick={() => {
                  if (menulaterale.funzione) {
                    menulaterale.funzione();
                  }
                }}
              >
                <ListItemIcon className="drawer-list-icon">
                  {menulaterale.icon && <menulaterale.icon fontSize="small" />}
                </ListItemIcon>
                <ListItemText
                  primary={menulaterale.testo}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {sectionIndex !== sezioni.length - 1 && <Divider className="drawer-divider" />}
      </React.Fragment>
    ))}
  </Box>
);

export default Drawer;