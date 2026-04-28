import { i18n } from "@lingui/core";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../App';
import { TypeUser } from '../../general/structure/Constant';
import { getMenuLaterale } from '../../general/structure/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import GamificationContent from './GamificationContent';

const Gamification: React.FC<{}> = ({ }) => {
  const { user, setUser } = useUser();
  const subTitle = user.type === TypeUser.FAMILY ? i18n._("tutorato") : ''
  const [title, setTitle] = useState<string>(i18n._("sezione_sfide_premi") + subTitle);
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const menuLaterale = getMenuLaterale(navigate, user);
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [paddingType, setPaddingType] = useState<number>(isVertical ? 0 : 5);
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe


  useEffect(() => {

    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
      setPaddingType(window.innerHeight > window.innerWidth ? 0 : 5);
    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <PageLayout
        title={title}
        menuLaterale={menuLaterale}
        alertConfig={{open,setOpen,message,setMessage}}
        isVertical={isVertical}
        handleClose={handleClose}
        navigate={useNavigate()}
      >
        <GamificationContent
          user={user}
          alertConfig={{open,setOpen,message,setMessage}}
          isVertical={isVertical}
        />
      </PageLayout>
      <div>
        {/* Contenuto aggiuntivo, se necessario */}
      </div>
    </>
  );
};

export default Gamification;






