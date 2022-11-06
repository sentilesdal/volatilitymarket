import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@rainbow-me/rainbowkit/styles.css";

import {
  RainbowKitProvider,
  darkTheme,
  midnightTheme,
  Theme,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { wagmiClient, chains } from "./provider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={
          {
            ...midnightTheme({
              accentColor: "hsl(var(--b1) / var(--bg-opacity))",
              fontStack: "system",
            }),

            colors: {
              connectButtonBackground: "bg-base-100",
              generalBorder: "hsl(var(--b1) / var(--tw-bg-opacity))",
              modalBorder: "hsl(var(--b1) / var(--tw-bg-opacity))",
            },
          } as Theme
        }
        modalSize="compact"
      >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
