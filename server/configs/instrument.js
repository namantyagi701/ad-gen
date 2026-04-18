import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://4d9b8927308822cf23b66027e4b650f4@o4511224756961280.ingest.us.sentry.io/4511224784814080",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});