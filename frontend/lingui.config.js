const { formatter } = require("@lingui/format-json");

/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ["en", "it", "fr", "de", "es", "pt"],
  sourceLocale: "it",
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  // Configurazione corretta per il formato JSON minimal (chiave: valore)
  format: formatter({ style: "minimal" }),
};