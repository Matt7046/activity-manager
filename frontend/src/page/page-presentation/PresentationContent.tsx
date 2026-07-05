"use client";
import { navigateRouting } from "@/general/structure/Utils";
import { Trans, useLingui } from "@lingui/react";
import LinkNext from "next/link";
import { useRouter } from "next/navigation";
import BannerOpenSource from "../../components/ms-banner/Banner";
import TechFooter from "../../components/ms-tech-footer/TechFooter";
import { Button } from "@/components/ui/button";
import { SectionName } from "../../general/structure/Constant";
import "../../components/ms-presentation/Presentation.css";
import "./PresentationContent.css";

const PresentationContent: React.FC = () => {
  const router = useRouter();
  const { i18n } = useLingui();

  return (
    <>
      <div className="page-wrapper">
        <BannerOpenSource />
        <div className="welcome-container">
          <div className="hero-frame">
            <div className="hero-content">
              <label
                htmlFor="enter-button"
                className="welcome-description-title block text-2xl font-bold"
              >
                <Trans id="testo_entry" />
              </label>

              <p className="welcome-description mb-4 text-base">
                <Trans id="testo_desc" />
              </p>

              <Button
                id="enter-button"
                className="enter-button h-11 w-full text-base"
                size="lg"
                onClick={() => navigateRouting(router, SectionName.HOME, {})}
              >
                <Trans id="testo_button" />
              </Button>

              <p className="personality-link-row mt-4 text-sm">
                <LinkNext href="/personality" className="personality-link underline">
                  {i18n._("personality_discover_link")}
                </LinkNext>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="tech-wrapper">
        <TechFooter />
      </div>
    </>
  );
};

export default PresentationContent;
