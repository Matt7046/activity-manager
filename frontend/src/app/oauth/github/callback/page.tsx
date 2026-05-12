"use client";

import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

/**
 * GitHub OAuth redirect in popup: ?code=&state= → postMessage all’opener (Home), poi chiudi.
 * Registra la stessa URL come “Authorization callback URL” nell’OAuth App GitHub.
 */
export default function GitHubOAuthCallbackPage() {
  const [hint, setHint] = useState("Completamento accesso GitHub…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      setHint(errorDescription ?? error);
      if (window.opener) {
        window.opener.postMessage(
          { type: "github-oauth", error, errorDescription },
          window.location.origin,
        );
      }
      return;
    }

    if (window.opener && code) {
      window.opener.postMessage({ type: "github-oauth", code, state }, window.location.origin);
      window.close();
      return;
    }

    setHint("Parametri OAuth mancanti. Apri il login dalla pagina Home.");
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="body2">{hint}</Typography>
    </Box>
  );
}
