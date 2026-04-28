import { Trans } from "@lingui/react";
import React from "react";
import Language from "../../components/ms-language/Language";
import "./PrivacyPolicy.css";

const PrivacyPolicy: React.FC = () => {
  return (
    <><div className="privacy-container">
      {/* Contenitore per allineare il selettore lingua a destra */}
      <div className="privacy-header">
        <Language />
      </div>
      <h1 className="privacy-title">
        <Trans id="privacy_policy" />
      </h1>
      <p className="privacy-text">
        <Trans id="privacy_descrizione" />
      </p>

      <h2 className="privacy-subtitle">
        <Trans id="1_dati_personali_raccolti" />
      </h2>
      <p className="privacy-text">
        <Trans id="raccogliamo_dati_desc" />
      </p>
      <ul className="privacy-list">
        <li><Trans id="email" /></li>
        <li><Trans id="altri_dati_volontari" /></li>
      </ul>

      <h2 className="privacy-subtitle">
        <Trans id="2_finalita_del_trattamento" />
      </h2>
      <p className="privacy-text">
        <Trans id="finalita_desc" />
      </p>
      <ul className="privacy-list">
        <li><Trans id="inviarti_aggiornamenti_sul_progetto_open_source" /></li>
        <li><Trans id="comunicarti_nuove_funzionalita_eventi_o_opportunita_di_contribuire" /></li>
        <li><Trans id="accedere_alla_applicazione" /></li>
      </ul>

      <h2 className="privacy-subtitle">
        <Trans id="3_conservazione_dei_dati" />
      </h2>
      <p className="privacy-text">
        <Trans id="conservazione_dati_desc" />
      </p>

      <h2 className="privacy-subtitle">
        <Trans id="4_diritti_dellutente" />
      </h2>
      <p className="privacy-text">
        <Trans id="diritti_utente_desc" />
      </p>
      <ul className="privacy-list">
        <li><Trans id="accedere_ai_tuoi_dati_personali" /></li>
        <li><Trans id="richiedere_la_correzione_o_la_cancellazione_dei_tuoi_dati" /></li>
        <li><Trans id="revocare_il_consenso_al_trattamento" /></li>
        <li><Trans id="portabilita_dei_dati" /></li>
        <li><Trans id="opporsi_al_trattamento_dei_dati" /></li>
      </ul>
      <p className="privacy-text">
        <Trans id="per_esercitare_diritti" />{" "}
        <a href="mailto:matteo.santangelo@colorsdev.tech" className="privacy-link">
          matteo.santangelo@colorsdev.tech
        </a>.
      </p>

      <h2 className="privacy-subtitle">
        <Trans id="5_sicurezza_dei_dati" />
      </h2>
      <p className="privacy-text">
        <Trans id="sicurezza_dati_desc" />
      </p>

      <h2 className="privacy-subtitle">
        <Trans id="6_modifiche_alla_privacy_policy" />
      </h2>
      <p className="privacy-text">
        <Trans id="modifiche_policy_desc" />
      </p>

      <p className="privacy-text">
        <Trans id="ultimo_aggiornamento" />: 18 gennaio 2025.
      </p>
    </div></>
  );
};

export default PrivacyPolicy;