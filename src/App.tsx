import React from "react";
import "./App.css";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { Balance } from "./Balance";
import { CreateTicket } from "./CreateTicket";
import { Tickets } from "./Tickets";
import { MarketInfo } from "./MarketInfo";

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
      <h1 className="text-5xl font-thin">Volatility Protocol</h1>
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
    </div>
  );
}

export interface TicketProps {
  id: string;
}
