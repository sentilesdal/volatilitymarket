import React, { useCallback } from "react";
import "./App.css";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { constants, Signer } from "ethers";

import { addresses } from "./addresses";
import { CreateTicket } from "./CreateTicket";
import { IERC20__factory, VolatilityMarket__factory } from "./typechain-types";
import { Balance } from "./Balance";
import { Tickets } from "./Tickets";
import { ApproveButton } from "./ApproveButton";

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
    <div className="text-sm flex justify-between p-2 w-full">
      <h1 className="text-5xl font-bold">Volatility Protocol</h1>
      <ConnectButton chainStatus="icon" label="Connect" />
    </div>
  );
}

function Body() {
  return (
    <div className="flex justify-around w-full">
      <div className="flex flex-col space-y-4 align-middle">
        <Balance />
        <ApproveButton />
        <CreateTicket />
      </div>
      <Tickets />
    </div>
  );
}

export interface TicketProps {
  id: string;
}

export function useHandleApprove(signer: Signer | undefined) {
  return useCallback(async () => {
    if (!signer) {
      return;
    }
    const volatilityMarket = VolatilityMarket__factory.connect(
      addresses.TicketManager,
      signer
    );
    const tokenAddress = await volatilityMarket.token();
    const token = IERC20__factory.connect(tokenAddress, signer);
    await token.approve(addresses.TicketManager, constants.MaxUint256);
  }, [signer]);
}
