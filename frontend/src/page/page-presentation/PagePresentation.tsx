"use client";

import "@/components/ms-presentation/Presentation.css";
import Language from "@/components/ms-language/Language";
import React from "react";
import PagePresentationContent from "./PagePresentationContent";

const PagePresentation: React.FC = () => {
  return (
    <div className="presentation-page">
      <div className="presentation-header">
        <Language />
      </div>
      <PagePresentationContent />
    </div>
  );
};

export default PagePresentation;
