export const backendApiUrl =
  process.env.NODE_ENV === "development"
    ? `${window.location.protocol}//${window.location.hostname}:53000/api`
    : `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`;

export const backendPubSubApiUrl =
  process.env.NODE_ENV === "development"
    ? `wss://${window.location.hostname}:53000/api`
    : `wss://${window.location.hostname}:${window.location.port}/api`;
