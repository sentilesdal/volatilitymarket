import React, { useCallback, useState } from "react";

import { Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useSigner } from "wagmi";

import { addresses } from "./addresses";
import { VolatilityMarket__factory } from "./typechain-types";

export function CreateTicket() {
  const { data: signerResult } = useSigner();
  const signer = signerResult as Signer;
  const [direction, setDirection] = useState(true);
  const handleCreateTicket = useHandleCreateTicket(signer, direction);
  return (
    <div className="flex flex-col w-full">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Amount</span>
        </label>
        <input
          type="text"
          placeholder="0.00"
          className="input input-bordered w-full max-w-xs"
        />
        <label className="label">
          <span className="label-text-alt">min 1.0</span>
          <span className="label-text-alt">max 10.0</span>
        </label>
      </div>
      <div className="flex flex-col h-full pb-4">
        <label className="label">
          <span className="label-text">Bid direction</span>
        </label>
        <div className="flex space-x-4">
          <input
            type="radio"
            name="radio-2"
            className="radio radio-primary"
            checked={direction}
            onChange={() => setDirection(true)}
          />
          <input
            type="radio"
            name="radio-2"
            className="radio radio-primary"
            checked={!direction}
            onChange={() => setDirection(false)}
          />
          <span className="label-text-alt">
            {direction ? "increase" : "decrease"}
          </span>
        </div>
      </div>
      <button onClick={() => handleCreateTicket()} className="btn btn-primary">
        Create new bid
      </button>
    </div>
  );
}

function useHandleCreateTicket(signer: Signer | undefined, direction: boolean) {
  return useCallback(() => {
    if (!signer) {
      return;
    }
    const volatilityMarket = VolatilityMarket__factory.connect(
      addresses.TicketManager,
      signer
    );
    volatilityMarket.createBet(parseEther("0.001"), direction ? 1 : 2);
  }, [direction, signer]);
}
