"use client";

import { useLingui } from "@lingui/react";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { useRouter } from "next/navigation";
import React from "react";
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import { SectionName } from "../../general/structure/Constant";
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
    icon: PsychologyIcon,
  };

  return (
    <PageLayout
      section={section}
      alertConfig={{ open, setOpen, message, setMessage }}
      isVertical={isVertical}
      handleClose={() => setOpen(false)}
      navigate={useRouter()}
      hiddenEmail={true}
    >
      <PagePersonalityContent />
    </PageLayout>
  );
};

export default PagePersonality;
