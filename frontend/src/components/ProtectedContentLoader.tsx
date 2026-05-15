"use client";

import { isUserValorizzato, useUser } from "@/context/UserContext";
import { PUBLIC_SECTION_PATHS, SectionName } from "@/general/structure/Constant";
import { navigateRouting } from "@/general/structure/Utils";
import { Trans } from "@lingui/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useEffect, useState } from "react";
import { MenuLaterale } from "./ms-drawer/Drawer";

export interface ProtectedContentLoaderProps {
  /** Caricamento dati principale (es. prima fetch). */
  isLoading?: boolean;
  navigate: AppRouterInstance; // Gestione padding dinamico
  section: MenuLaterale
  children: React.ReactNode;
}

/**
 * Finché non c’è utente valorizzato o durano i caricamenti, mostra il messaggio “caricamento”
 * senza montare i figli (niente API / effetti del contenuto).
 */
export const ProtectedContentLoader = ({
  isLoading = false,
  navigate,
  section,
  children
}: ProtectedContentLoaderProps) => {
  const { user } = useUser();
  const [inizialLoad, setInitialLoad] = useState(() => !isUserValorizzato(user));

  useEffect(() => {
    if (isUserValorizzato(user)) {
      setInitialLoad(false);
    } else {
      setInitialLoad(true);
    }
  }, [user]);

  useEffect(() => {
    const p = section.path;
    const isPublic = p != null && PUBLIC_SECTION_PATHS.has(p);
    if (!isPublic && !isUserValorizzato(user)) {
      navigateRouting(navigate, SectionName.ROOT, {});
    }
  }, [user, navigate, section.path]);



  if (!isUserValorizzato(user) || inizialLoad || isLoading) {
    return (
      <p>
        <Trans id="caricamento" />
      </p>
    );
  }

  return <>{children}</>;
}
