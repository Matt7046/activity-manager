"use client";

import { useLingui } from "@lingui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import { SectionName } from "../../general/structure/Constant";
import { getSectionAnnotazione, getSectionMenuIcon } from "../../general/structure/Utils";
import PageLayout, { TypeMessage } from "../page-layout/PageLayout";
import PagePrivacyPolicyContent from "./PrivacyPolicyContent";

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
    testo: i18n._("privacy_policy"),
    path: SectionName.POLICY,
    icon: getSectionMenuIcon(SectionName.POLICY),
    annotazione: getSectionAnnotazione(SectionName.POLICY),
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
      <PagePrivacyPolicyContent />
    </PageLayout>
  );
};

export default PagePersonality;
