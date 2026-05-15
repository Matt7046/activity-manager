"use client";
import { ProtectedContentLoader } from '@/components/ProtectedContentLoader';
import { useUser } from '@/context/UserContext';
import { useLingui } from "@lingui/react";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import { SectionName, SectionNameDesc } from '../../general/structure/Constant';
import { getMenuLaterale, getSectionMenuIcon } from '../../general/structure/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import PointsContent from './UserPointContent';
export interface UserPointsI {
  _id?: string | undefined;
  email?: string;
  emailChild?:string;
  password?: string;
  numeroPunti?: number;
  usePoints?: number;
  nameImage?: string;
  /** _id della card (stringa qualsiasi): aggiorna solo quell'immagine in imagesBySlot. */
  imageCardId?: string;
  status?: number;
  emailUserCurrent?: string
}


export interface ImageI {

  file: FormData;
  width: number;
  height: number;

}


export interface NameImageI {

  name: string;
}

const Points: React.FC<{}> = ({ }) => {

  const { user, setUser } = useUser();
  const { i18n } = useLingui();
  const router = useRouter(); // Ottieni la funzione di navigazione
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



    return () => {
      window.removeEventListener("resize", handleResize)
    };
  }, []);



  const handleClose = () => {
    setOpen(false);
  };
  const section: MenuLaterale = {
    testo: SectionNameDesc.POINTS,
    path: SectionName.POINTS,
    icon: getSectionMenuIcon(SectionName.POINTS),
  };
  return (
    <>
      <ProtectedContentLoader navigate={router} section={section}>
        <PageLayout

          section={section}
          menuLaterale={menuLaterale}
          alertConfig={{ open, setOpen, message, setMessage }}
          isVertical={isVertical}
          handleClose={handleClose}
          navigate={router}
        >
          <PointsContent
            user={user}
            alertConfig={{ open, setOpen, message, setMessage }}
            isVertical={isVertical}
          />
        </PageLayout>
      </ProtectedContentLoader>
      <div>
        {/* Contenuto aggiuntivo, se necessario */}
      </div>
    </>
  );
};

export default Points;






