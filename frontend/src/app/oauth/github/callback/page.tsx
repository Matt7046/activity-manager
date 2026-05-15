"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Compatibilità: vecchia “Authorization callback URL” …/oauth/github/callback.
 * Il flusso attuale usa `/home` come redirect_uri (allineato al useEffect su Home).
 */
const GitHubOAuthCallbackPage = () => {
  const router = useRouter();
  const [hint, setHint] = useState("Reindirizzamento…");

  useEffect(() => {
    const search = window.location.search;
    if (search && (search.includes("code=") || search.includes("error="))) {
      router.replace(`/home${search}`);
      return;
    }
    setHint("Parametri OAuth mancanti. Apri il login dalla pagina Home.");
  }, [router]);

  return (
    <div style={{ padding: 24, fontSize: 14 }}>
      {hint}
    </div>
  );
}

export default GitHubOAuthCallbackPage;