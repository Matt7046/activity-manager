"use client";

import Language from "@/components/ms-language/Language";
import React from "react";
import PagePresentationContent from "./PagePresentationContent";

const PagePresentation: React.FC = () => {
  return (
    <>
      <div className="presentation-header">
        <Language />
      </div>
      <PagePresentationContent />
    </>
  );
};

export default PagePresentation;
