"use client";
import { useUser } from '@/context/UserContext';
import { useLingui } from "@lingui/react";
import InfoIcon from '@mui/icons-material/Info'; // About
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import { SectionNameDesc } from "../../general/structure/Constant";
import { getMenuLaterale } from '../../general/structure/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import AboutContent from './AboutContent';

const About: React.FC<{}> = ({ }) => {
  const { user, setUser } = useUser();
  const { i18n } = useLingui();
  const router = useRouter(); // Ottieni la funzione di navigazione
  const menuLaterale = getMenuLaterale(router, user);
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [paddingType, setPaddingType] = useState<number>(isVertical ? 0 : 5);
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe
  const searchParams = useSearchParams();
  const _id = searchParams.get('_id');

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
      setPaddingType(window.innerHeight > window.innerWidth ? 0 : 5);
    };

    window.addEventListener("resize", handleResize);
    return () => {
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const section: MenuLaterale = {
    testo: SectionNameDesc.ABOUT(_id),
    icon: InfoIcon
  }

  return (
    <>
      <PageLayout
        section={section}
        menuLaterale={menuLaterale}
        alertConfig={{ open, setOpen, message, setMessage }}
        isVertical={isVertical}
        handleClose={handleClose}
        navigate={useRouter()}
      >
        <AboutContent
          identificativo = {_id!}
          user={user}
          setMessage={setMessage}
          setOpen={setOpen}
          isVertical={isVertical}
        />
      </PageLayout>
    </>
  );
};

export default About;






