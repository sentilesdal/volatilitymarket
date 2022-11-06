import React, { ChangeEventHandler, useCallback, useState } from "react";

import { Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useAccount, useBalance, useSigner } from "wagmi";

import { addresses } from "./addresses";
import { ApproveButton } from "./ApproveButton";
import { Balance } from "./Balance";
import { useAllowance } from "./hooks/useAllowance";
import { useMarketInfo } from "./hooks/useMarketInfo";
import { toasts } from "./Toaster";
import { VolatilityMarket__factory } from "./typechain-types";

const maxAmount = parseEther("1");
const minAmount = parseEther("0.01");

export function CreateTicket() {
  const { data: signerResult } = useSigner();
  const { address } = useAccount();
  const signer = signerResult as Signer;
  const [direction, setDirection] = useState(true);
  const { tokenAddress } = useMarketInfo(addresses.TicketManager);
  const allowance = useAllowance(tokenAddress, addresses.TicketManager);
  const { data: balanceResult } = useBalance({
    addressOrName: address,
    token: tokenAddress as `0x${string}`,
  });
  const balance = balanceResult?.formatted || "0";

  const [_amount, setAmount] = useState("");
  const amount = _amount || "0";
  const handleCreateTicket = useHandleCreateTicket(
    signer,
    amount.toString(),
    direction
  );

  const handleChangeAmount = useCallback<ChangeEventHandler>((event) => {
    setAmount((event.target as any).value);
  }, []);

  const hasEnoughAllowance = allowance?.gt(parseEther(amount.toString()));

  const validAmount =
    parseEther(amount).lte(parseEther(balance)) &&
    parseEther(amount).lte(maxAmount) &&
    parseEther(amount).gte(minAmount);

  return (
    <div className="flex flex-col card w-96 bg-base-100 shadow-xl justify-items-center p-4 align-middle">
      <p className="font-thin">Create a bid</p>
      <Balance />
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Amount</span>
        </label>
        <input
          type="number"
          placeholder="0.00"
          className="input input-bordered w-full"
          value={_amount}
          onChange={handleChangeAmount}
        />
        <label className="label">
          <span className="label-text-alt">min 0.01</span>
          <span className="label-text-alt">max 1.0</span>
        </label>
      </div>
      <div className="flex flex-col pb-4">
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
          disabled={!validAmount}
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

function useHandleCreateTicket(
  signer: Signer | undefined,
  amount: string,
  direction: boolean
) {
  return useCallback(async () => {
    if (!signer) {
      return;
    }
    const volatilityMarket = VolatilityMarket__factory.connect(
      addresses.TicketManager,
      signer
    );
    const tx = await volatilityMarket.createBet(
      parseEther(amount),
      direction ? 1 : 2
    );
    toasts[tx.hash] = {
      txHash: tx.hash,
      message: "Transaction submitted",
      status: "info",
    };
    const timeoutId = setTimeout(() => delete toasts[tx.hash], 5000);

    tx.wait(1).then(() => {
      clearTimeout(timeoutId);
      toasts[tx.hash] = {
        txHash: tx.hash,
        message: "Transaction succeeded",
        status: "success",
      };
      setTimeout(() => delete toasts[tx.hash], 5000);
    });
  }, [amount, direction, signer]);
}
