import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber, Signer } from "ethers";
import { chainId, useProvider, useSigner } from "wagmi";

import { VolatilityMarket__factory } from "./typechain-types";
import { parseEther } from "ethers/lib/utils";

export const YourApp = () => {};

const addresses = {
  TicketManager: "0x2dbb2bfab0d9e7ffa3255611a5c497f45062cf41",
};

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
    <div className="flex justify-between p-2 w-full">
      <h1 className="text-5xl font-bold">Volatility Protocol</h1>
      <ConnectButton label="Connect" />
    </div>
  );
}

function Body() {
  const { data: signer } = useSigner();
  const tickets = useTickets();
  const [direction, setDirection] = useState(true);
  const handleCreateTicket = useCallback(() => {
    console.log("handleCreateTicket inner");
    if (!signer) {
      return;
    }
    const volatilityMarket = VolatilityMarket__factory.connect(
      addresses.TicketManager,
      signer
    );
    volatilityMarket.createBet(parseEther("0.01"), direction ? 1 : 2);
  }, [direction, signer]);

  return (
    <div className="flex justify-around w-full">
      <div className="flex align-middle space-x-4">
        <button
          onClick={() => handleCreateTicket()}
          className="btn btn-primary"
        >
          Create new ticket
        </button>
        <div className="h-full">
          <input
            type="radio"
            name="radio-2"
            className="radio radio-primary"
            checked={direction}
            onChange={() => setDirection(true)}
          />
        </div>
        <div className="h-full">
          <input
            type="radio"
            name="radio-2"
            className="radio radio-primary"
            checked={!direction}
            onChange={() => setDirection(false)}
          />
        </div>
      </div>
      <div className="flex flex-col h-full text-center space-y-2">
        {tickets.map((ticket) => (
          <Ticket key={ticket.id.toHexString()} id={ticket.id.toHexString()} />
        ))}
      </div>
    </div>
  );
}

interface TicketProps {
  id: string;
}

function Ticket(props: TicketProps) {
  const { id } = props;
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{`Ticket ${id.slice(0, 6)}...${id.slice(
          -4
        )}`}</h2>
        <p></p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Verify</button>
        </div>
      </div>
    </div>
  );
}

type TicketStruct = [
  BigNumber,
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  number,
  boolean
] & {
  id: BigNumber;
  owner: string;
  betTime: BigNumber;
  verifyTime: BigNumber;
  amount: BigNumber;
  direction: number;
  claimed: boolean;
};
function useTickets() {
  const provider = useProvider({ chainId: chainId.goerli });
  const volatilityMarket = VolatilityMarket__factory.connect(
    addresses.TicketManager,
    provider
  );

  const [tickets, setTickets] = useState<TicketStruct[]>([]);

  useEffect(() => {
    fetchData();
    async function fetchData() {
      try {
        const filter = volatilityMarket.filters.TicketCreated();
        const result = await volatilityMarket.queryFilter(filter);
        const ids = result.map((r) => r.args.id);
        const getTickets = ids.map((id) =>
          volatilityMarket.callStatic.tickets(id)
        );
        const tickets: TicketStruct[] = await Promise.all(getTickets);
        setTickets(tickets);
      } catch (error) {
        console.log("error", error);
      }
    }
    // only want this to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return tickets;
}
