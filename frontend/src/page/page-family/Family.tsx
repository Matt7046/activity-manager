"use client";
import { useUser } from '@/context/UserContext';
import { useLingui } from "@lingui/react";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import { SectionNameDesc } from "../../general/structure/Constant";
import { getMenuLaterale } from '../../general/structure/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import FamilyContent from './FamilyContent';



export interface FamilyLogI {
  _id?: string;
  performedByEmail: string;
  receivedByEmail: string;
  date: Date;
  operations: string;
  usePoints: number;

}

const Family: React.FC<{}> = ({ }) => {



  const router = useRouter(); // Ottieni la funzione di navigazione
  const { user, setUser } = useUser();
  const { i18n } = useLingui();
  const menuLaterale = getMenuLaterale(router, user);
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

  const section: MenuLaterale = {
    testo: SectionNameDesc.FAMILY
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
        <FamilyContent
          alertConfig={{ open, setOpen, message, setMessage }}
          isVertical={isVertical}
        />
      </PageLayout>
    </>
  );
};

export default Family;






