"use client";
import { useLingui } from "@lingui/react";
import LoginIcon from '@mui/icons-material/Login';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import { SectionNameDesc } from "../../general/structure/Constant";
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import HomeContent from './HomeContent';

const Home: React.FC<{}> = ({ }) => {
  const { i18n } = useLingui();
  const router = useRouter(); // Ottieni la funzione di navigazione
  const menuLaterale: MenuLaterale[][] = [];
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize)
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const section: MenuLaterale = {
    testo: SectionNameDesc.ROOT,
    icon: LoginIcon
  }
  return (
    <>
      <PageLayout
        section={section}
        menuLaterale={menuLaterale}
        alertConfig={{ open, setOpen, message, setMessage }}
        isVertical={isVertical}
        handleClose={handleClose}
        navigate={useRouter()}>
        <HomeContent
        />
      </PageLayout>
    </>
  );
};

export default Home;






