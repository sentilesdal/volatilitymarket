import React from "react";
import "./App.css";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { CreateTicket } from "./CreateTicket";
import { MarketInfo } from "./MarketInfo";
import { Tickets } from "./Tickets";
import { ReactComponent as Logo } from "./pulse-14.svg";
import { Toaster, toasts } from "./Toaster";

export const YourApp = () => {};

function App() {
  return (
    <div className="App h-full">
      <header className="App-header">
        <div className="flex flex-col hero min-h-screen bg-base-200 h-full">
          <Header />
          <Body />
        </div>
      </header>
    </div>
  );
}

export default App;
function Header() {
  return (
    <div className="text-sm flex justify-between p-4 w-full">
      <div className="flex text-center justify-center align-middle space-x-4">
        <h1 className="text-5xl font-thin text-center">Volatility Protocol</h1>
        <Logo
          fill="currentColor"
          stroke="currentColor"
          className="h-16 w-16 text-violet-500"
        />
      </div>
      <ConnectButton chainStatus="icon" label="Connect Wallet" />
    </div>
  );
}

function Body() {
  return (
    <div className="flex justify-around w-full p-12">
      <div>
        <MarketInfo />
      </div>
      <div>
        <CreateTicket />
      </div>
      <Tickets />
      <Toaster toasts={toasts} />
    </div>
  );
}
