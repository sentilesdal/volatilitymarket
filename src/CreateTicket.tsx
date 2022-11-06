import React, { ChangeEventHandler, useCallback, useState } from "react";

import { BigNumber, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useAccount, useContractRead, useSigner } from "wagmi";

import { addresses } from "./addresses";
import { ApproveButton } from "./ApproveButton";
import { useMarketInfo } from "./hooks/useMarketInfo";
import { ERC20__factory, VolatilityMarket__factory } from "./typechain-types";

export function CreateTicket() {
  const { data: signerResult } = useSigner();
  const signer = signerResult as Signer;
  const [direction, setDirection] = useState(true);
  const handleCreateTicket = useHandleCreateTicket(signer, direction);
  const { tokenAddress } = useMarketInfo(addresses.TicketManager);
  const allowance = useAllowance(tokenAddress, addresses.TicketManager);
  console.log("allowance", allowance);

  const [amount, setAmount] = useState(0);
  const handleChangeAmount = useCallback<ChangeEventHandler>((event) => {
    console.log("event", (event?.target as any).value);
    setAmount((event.target as any).value);
  }, []);

  const hasEnoughAllowance = allowance?.gt(parseEther(amount.toString()));

  return (
    <div className="flex flex-col w-full">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Amount</span>
        </label>
        <input
          type="number"
          placeholder="0.00"
          className="input input-bordered w-full max-w-xs"
          value={amount}
          onChange={handleChangeAmount}
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
      {hasEnoughAllowance ? (
        <button
          onClick={() => handleCreateTicket()}
          className="btn btn-primary"
        >
          Create new bid
        </button>
      ) : (
        <ApproveButton />
      )}
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

function useAllowance(tokenAddress: string, spenderAddress: string) {
  const { address: accountAddress } = useAccount();
  const { data: allowance } = useContractRead({
    abi: ERC20__factory.abi,
    address: tokenAddress,
    functionName: "allowance",
    args: [accountAddress, spenderAddress],
  });

  return allowance as BigNumber;
}
