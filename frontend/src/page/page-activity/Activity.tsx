"use client";
import { ProtectedContentLoader } from '@/components/ProtectedContentLoader';
import { useUser } from '@/context/UserContext';
import { useLingui } from "@lingui/react";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import { SectionName, SectionNameDesc } from "../../general/structure/Constant";
import { getMenuLaterale, getSectionAnnotazione, getSectionMenuIcon } from '../../general/structure/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import ActivityContent from './ActivityContent';
export interface ActivityI {
  _id: string | undefined;
  nome: string;
  subTesto: string;
  points?: number;
}

export interface ActivityLogI {
  _id?: string;
  email: string;
  log: string;
  date: Date;
  usePoints: number;

}

const Activity: React.FC<{}> = ({ }) => {

  const { i18n } = useLingui();
  const { user, setUser } = useUser();
  const router = useRouter(); // Ottieni la funzione di navigazione
  const menuLaterale = getMenuLaterale(router, user)
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [isLoading, setIsLoading] = useState(false);

  // default class Activity extends React.Component {


  const handleClose = () => {
    setOpen(false);
  };


  const section: MenuLaterale = {
    testo: SectionNameDesc.ACTIVITY,
    path: SectionName.ACTIVITY,
    icon: getSectionMenuIcon(SectionName.ACTIVITY),
    annotazione: getSectionAnnotazione(SectionName.ACTIVITY),
  };
  return (
    <>
      <ProtectedContentLoader isLoading={isLoading} navigate={router} section={section}>
        <PageLayout
          section={section} menuLaterale={menuLaterale}
          alertConfig={{ open, setOpen, message, setMessage }}
          isVertical={isVertical}
          showEmail={true}
          handleClose={handleClose}
          navigate={router}
        >

          <ActivityContent
            user={user}
            alertConfig={{ open, setOpen, message, setMessage }}
            isVertical={isVertical}
          />
        </PageLayout>
      </ProtectedContentLoader>
    </>
  );
}
export default Activity;
