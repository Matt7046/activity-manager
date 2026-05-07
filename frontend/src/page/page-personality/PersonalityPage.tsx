"use client";
import { useLingui } from "@lingui/react";
import Language from "@/components/ms-language/Language";
import React from "react";
import "./PersonalityPage.css";

const PersonalityPage: React.FC = () => {
  const { i18n } = useLingui();
  const t = (id: string) => i18n._(id).replace(/\\n/g, "\n");

  return (
    <div className="personality-container">
      <div className="personality-header">
        <Language />
      </div>

      <h1 className="personality-title">{t("personality_page_title")}</h1>

      <div className="personality-identity-card">
        <h2 className="personality-subtitle">{t("profilo_anagrafico")}</h2>
        <p className="personality-text"><strong>{t("nome_cognome")}:</strong> {t("personality_name_value")}</p>
        <p className="personality-text"><strong>{t("telefono")}:</strong> {t("personality_phone_value")}</p>
        <p className="personality-text"><strong>{t("email_contatto")}:</strong> {t("personality_email_value")}</p>
      </div>

      <p className="personality-text">{t("personality_prompt_1")}</p>
      <p className="personality-text">{t("personality_intro_limit")}</p>
      <p className="personality-text">{t("personality_intro_frame")}</p>

      <h2 className="personality-subtitle">{t("personality_general_title")}</h2>
      <p className="personality-text personality-preline">{t("personality_general_body")}</p>

      <h2 className="personality-subtitle">{t("personality_type_title")}</h2>
      <p className="personality-text personality-preline">{t("personality_type_body")}</p>

      <h2 className="personality-subtitle">{t("personality_goals_title")}</h2>
      <p className="personality-text personality-preline">{t("personality_goals_body")}</p>

      <h2 className="personality-subtitle">{t("personality_insecurities_title")}</h2>
      <p className="personality-text personality-preline">{t("personality_insecurities_body")}</p>

      <h2 className="personality-subtitle">{t("personality_fears_title")}</h2>
      <p className="personality-text personality-preline">{t("personality_fears_body")}</p>

      <h2 className="personality-subtitle">{t("personality_wants_title")}</h2>
      <p className="personality-text personality-preline">{t("personality_wants_body")}</p>

      <h2 className="personality-subtitle">{t("personality_final_title")}</h2>
      <p className="personality-text personality-preline">{t("personality_final_body")}</p>
    </div>
  );
};

export default PersonalityPage;
