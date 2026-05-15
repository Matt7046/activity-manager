"use client";

import { useLingui } from "@lingui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import { SectionName } from "../../general/structure/Constant";
import { getSectionAnnotazione, getSectionMenuIcon } from "../../general/structure/Utils";
import PageLayout, { TypeMessage } from "../page-layout/PageLayout";
import PagePersonalityContent from "./PersonalityContent";

const PagePersonality: React.FC = () => {
  const { i18n } = useLingui();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState<TypeMessage>({});
  const [isVertical, setIsVertical] = React.useState<boolean>(window.innerHeight > window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setIsVertical(window.innerHeight > window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const section: MenuLaterale = {
    testo: i18n._("personality_page_title"),
    path: SectionName.PERSONALITY,
    icon: getSectionMenuIcon(SectionName.PERSONALITY),
    annotazione: getSectionAnnotazione(SectionName.PERSONALITY),
  };

  return (
    <PageLayout
      section={section}
      alertConfig={{ open, setOpen, message, setMessage }}
      isVertical={isVertical}
      showEmail={false}
      handleClose={() => setOpen(false)}
      navigate={useRouter()}
    >
      <PagePersonalityContent />
    </PageLayout>
  );
};

export default PagePersonality;
