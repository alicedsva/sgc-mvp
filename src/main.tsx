
  import { createRoot } from "react-dom/client";
  import * as amplitude from "@amplitude/unified";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  amplitude.initAll(import.meta.env.VITE_AMPLITUDE_API_KEY, {
    analytics: {
      autocapture: {
        attribution: true,
        pageViews: true,
        sessions: true,
        formInteractions: true,
        fileDownloads: true,
        elementInteractions: true,
        frustrationInteractions: true,
        pageUrlEnrichment: true,
        networkTracking: true,
        webVitals: true,
      },
    },
    sessionReplay: { sampleRate: 1 },
  });

  createRoot(document.getElementById("root")!).render(<App />);
