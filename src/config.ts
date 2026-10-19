export interface AppConfig {
  mode: "mock";
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const requestedMode = (env.DEMO_MODE ?? "mock").trim().toLowerCase();

  // This scaffold deliberately supports mock mode only until authorized
  // sandbox access and the current API contract have been verified.
  if (requestedMode !== "mock") {
    throw new Error(
      'This proof-of-work scaffold only supports DEMO_MODE="mock". ' +
      "Implement a live adapter only after authorized sandbox access and contract validation."
    );
  }

  return { mode: "mock" };
}
