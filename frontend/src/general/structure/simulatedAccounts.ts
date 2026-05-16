/** Account demo: login con password solo in modalità demo; niente ripristino password. */
export const SIMULATED_DEMO_EMAILS = ["user@simulated.com", "child@simulated.com"] as const;

export const isSimulatedDemoEmail = (email: string): boolean => {
  const normalized = email.trim().toLowerCase();
  return (SIMULATED_DEMO_EMAILS as readonly string[]).includes(normalized);
};
