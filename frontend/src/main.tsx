import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { SUI_NETWORK, SUI_RPC_URL } from "./lib/constants";
import "@mysten/dapp-kit/dist/index.css";
import "./styles.css";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={{ [SUI_NETWORK]: { url: SUI_RPC_URL, network: SUI_NETWORK } }} defaultNetwork={SUI_NETWORK}>
        <WalletProvider autoConnect enableUnsafeBurner>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
