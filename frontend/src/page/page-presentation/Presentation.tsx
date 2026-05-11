"use client";

import Language from "@/components/ms-language/Language";
import "@/components/ms-presentation/Presentation.css";
import ThemeToggle from "@/components/ms-theme-toggle/ThemeToggle";
import { IconButton, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import PresentationContent from "./PresentationContent";
import "./PresentationContent.css";

const cdLogo = (
  <img
    src="/logo-colorsdev.png"
    alt=""
    width={50}
    height={50}
    className="presentation-header-brand-logo"
    loading="lazy"
    decoding="async"
  />
);

const aziende: { name: string; icon: ReactNode; brandLogo?: boolean }[] = [
  { name: "colorsdev.tech", icon: cdLogo, brandLogo: true }]

 
const PagePresentation: React.FC = () => {
  return (
    <div className="presentation-page">
      <div className="presentation-header">
        
        {/* Spacer a sinistra per garantire che le icone siano perfettamente al centro */}
        <div className="header-spacer" />

        {/* Container centrale per le icone delle aziende */}
        <div className="techf-container">
          {aziende.map((tech) => (
            <div key={tech.name} className="techf-item">
              <IconButton color="inherit" disabled className="presentation-header-brand-btn">
                <span className={`techf-icon-wrap${tech.brandLogo ? " techf-icon-wrap-brand" : ""}`}>
                  {tech.icon}
                </span>
              </IconButton>
              <Typography variant="caption" display="block" className="techf-name">
                {tech.name}
              </Typography>
            </div>
          ))}
        </div>

        {/* Pulsante lingua allineato a destra */}
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
