"use client";

import Language from "@/components/ms-language/Language";
import ThemeToggle from "@/components/ms-theme-toggle/ThemeToggle";
import { Button } from "@/components/ui/button";
import React, { ReactNode } from "react";
import PresentationContent from "./PresentationContent";
import "@/components/ms-presentation/Presentation.css";
import "./PresentationContent.css";

const cdLogo = (
  <img
    src="/logo-colorsdev-v2.png"
    alt=""
    width={220}
    height={70}
    className="presentation-header-brand-logo"
    loading="lazy"
    decoding="async"
  />
);

const aziende: { name: string; icon: ReactNode; brandLogo?: boolean }[] = [
  { name: "colorsdev.tech", icon: cdLogo, brandLogo: true },
];

const PagePresentation: React.FC = () => {
  return (
    <div className="presentation-page">
      <div className="presentation-header">
        <div className="header-spacer" />

        <div className="techf-container">
          {aziende.map((tech) => (
            <div key={tech.name} className="techf-item">
              <Button variant="ghost" disabled className="presentation-header-brand-btn">
                <span className={`techf-icon-wrap${tech.brandLogo ? " techf-icon-wrap-brand" : ""}`}>
                  {tech.icon}
                </span>
              </Button>
              <div className="techf-name block text-xs">
                {tech.name.includes(".") ? (
                  <>
                    <span className="techf-name-prefix">{tech.name.slice(0, tech.name.indexOf("."))}</span>
                    <span className="techf-name-tech">{tech.name.slice(tech.name.indexOf("."))}</span>
                  </>
                ) : (
                  tech.name
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="language-container">
          <ThemeToggle placement="header" />
          <Language placement="header" />
        </div>
      </div>

      <PresentationContent />
    </div>
  );
};

export default PagePresentation;
