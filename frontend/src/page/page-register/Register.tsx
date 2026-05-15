"use client";
import { useUser } from '@/context/UserContext';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import { SectionName, SectionNameDesc } from "../../general/structure/Constant";
import { getSectionAnnotazione, getSectionMenuIcon } from '../../general/structure/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import RegisterContent from './RegisterContent';

const Register: React.FC<{}> = ({ }) => {

  const pathname = usePathname();
  const { user, setUser } = useUser();
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
    testo: SectionNameDesc.REGISTER,
    path: SectionName.REGISTER,
    icon: getSectionMenuIcon(SectionName.REGISTER),
    annotazione: getSectionAnnotazione(SectionName.REGISTER),
  };
  return (
    <>
      <PageLayout
        section={section}
        alertConfig={{ open, setOpen, message, setMessage }}
        isVertical={isVertical}
        showEmail={false}
        handleClose={handleClose}
        navigate={useRouter()}
      >
        <RegisterContent
          user={user}
          alertConfig={{ open, setOpen, message, setMessage }}
          isVertical={isVertical}
        />
      </PageLayout>
    </>
  );
};

export default Register;






