import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { observer } from 'mobx-react';


type Anchor = 'top' | 'left' | 'bottom' | 'right';




const Drawer = observer((props: {
  //key: number;
  sezioni : string[][]; 
  nameMenu : string;
  anchor : Anchor;
  route? : string;
}) => {

  const [statoComponente, setStatoComponente] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  return (
    <div>
      {[props.anchor].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true, setStatoComponente, statoComponente)}>{props.nameMenu}</Button>
          <SwipeableDrawer
            anchor={anchor}
            open={statoComponente[anchor]}
            onClose={toggleDrawer(anchor, false, setStatoComponente, statoComponente)}
            onOpen={toggleDrawer(anchor, true ,setStatoComponente, statoComponente)}
          >
            {list1(anchor, props.sezioni,setStatoComponente, statoComponente)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
})


const toggleDrawer =
  (anchor: Anchor, open: boolean, setStatoComponente: ((arg0: any) => void), statoComponente: any) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setStatoComponente({ ...statoComponente, [anchor]: open });
    };




const list1 = (anchor: Anchor, sezioni: string[][],setStatoComponente: ((arg0: any) => void), statoComponente: any) => (
  <Box
    sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
    role="presentation"
    onClick={toggleDrawer(anchor, false,setStatoComponente, statoComponente)}
    onKeyDown={toggleDrawer(anchor, false, setStatoComponente, statoComponente)}
  >
    <>
      {sezioni.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <List>
            {section.map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {(sectionIndex * section.length + index) % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
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