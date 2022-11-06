import React, { useCallback, useEffect, useState } from "react";

import { BigNumber, Signer } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useAccount, useProvider, useSigner } from "wagmi";

import { addresses } from "./addresses";
import { formatAddress } from "./formatAddress";
import { useMarketInfo } from "./hooks/useMarketInfo";
import {
  OptimisticOracleV2Interface,
  OptimisticOracleV2Interface__factory,
  VolatilityMarket__factory,
} from "./typechain-types";
import { TicketStruct } from "./Types";
import { toasts } from "./Toaster";

interface TicketProps {
  ticket: TicketStruct;
}

const Direction = ["none", "increase", "decrease"];

export function Ticket(props: TicketProps) {
  const { data: signerResult } = useSigner();
  const signer = signerResult as Signer;
  const { address } = useAccount();
  const { identifier, ancillaryData, blockBuffer } = useMarketInfo(
    addresses.TicketManager
  );
  const { ticket } = props;
  const { id, betTime, amount, direction, owner, verifyTime } = ticket;

  const created = new Date(betTime.toNumber() * 1000);

  const handleVerifyTicket = useHandleVerifyTicket(signer, id);

  const handleRedeemTicket = useHandleRedeemTicket(signer, id);
  console.log("verifyTime", verifyTime);

  const priceRequest = usePriceRequest(
    addresses.TicketManager,
    identifier,
    betTime.toNumber(),
    ancillaryData
  );

  const verifyPriceRequest = usePriceRequest(
    addresses.TicketManager,
    identifier,
    verifyTime.toNumber(),
    ancillaryData
  );

  const initialPrice = priceRequest?.proposedPrice;
  const verifyPrice = verifyPriceRequest?.proposedPrice;
  const showRedeem =
    address === owner && !verifyTime.eq(betTime) && !ticket.claimed;
  const showClaimed = address === owner && ticket.claimed;

  const showVerify = address === owner && verifyTime.eq(betTime);
  const showExpired =
    address === owner &&
    verifyTime.eq(betTime) &&
    blockBuffer &&
    betTime.toNumber() + blockBuffer < Math.floor(Date.now() / 1000);

  return (
    <div className="card w-96 bg-base-100 shadow-xl p-4 " tabIndex={0}>
      <div className="font-thin collapse-title">{`Bid ID: ${formatAddress(
        id.toHexString()
      )}`}</div>

      <div className="">
        <div className="flex justify-between">
          <label className="label text-sm">
            <span className="label-text">Created</span>
          </label>
          <label className="label text-sm">
            <span className="label-text">{created.toLocaleDateString()}</span>
          </label>
        </div>

        <div className="flex justify-between">
          <label className="label text-sm">
            <span className="label-text">Amount</span>
          </label>
          <label className="label text-sm">
            <span className="label-text">{formatEther(amount)}</span>
          </label>
        </div>

        <div className="flex justify-between">
          <label className="label text-sm">
            <span className="label-text">Betting the price will...</span>
          </label>
          <label className="label text-sm">
            <span className="label-text">{Direction[direction]}</span>
          </label>
        </div>

        <div className="flex justify-between">
          <label className="label text-sm">
            <span className="label-text">Price at start</span>
          </label>
          <label className="label text-sm">
            <span className="label-text">
              {formatEther(initialPrice || BigNumber.from(0))}
            </span>
          </label>
        </div>

        {!verifyTime.eq(betTime) ? (
          <div className="flex justify-between">
            <label className="label text-sm">
              <span className="label-text">Price at verify</span>
            </label>
            <label className="label text-sm">
              <span className="label-text">
                {formatEther(verifyPrice || BigNumber.from(0))}
              </span>
            </label>
          </div>
        ) : (
          <div className="flex justify-between">
            <label className="label text-sm">
              <span className="label-text">Price now</span>
            </label>
            <label className="label text-sm">
              <span className="label-text">
                {formatEther(
                  parseEther("1").add(Math.floor(Date.now() / 1000))
                )}
              </span>
            </label>
          </div>
        )}

        <div className="flex justify-between">
          {showClaimed && (
            <div className={`card-actions justify-end}`}>
              <button className="btn btn-success text-white">Claimed</button>
            </div>
          )}

          {!showClaimed && (
            <div
              className={`card-actions justify-end ${
                showRedeem ? "" : "invisible"
              }`}
            >
              <button
                className="btn btn-secondary"
                onClick={() => handleRedeemTicket()}
              >
                Redeem
              </button>
            </div>
          )}

          <div
            className={`card-actions justify-end ${
              showExpired ? "" : "invisible"
            }`}
          >
            <button className="btn btn-error text-white">Expired</button>
          </div>
          {!showExpired && (
            <div
              className={`card-actions justify-end ${
                showVerify ? "" : "invisible"
              }`}
            >
              <button
                className="btn btn-primary"
                onClick={() => handleVerifyTicket()}
              >
                Verify
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function useHandleVerifyTicket(signer: Signer | undefined, id: BigNumber) {
  return useCallback(async () => {
    if (!signer) {
      return;
    }
    const volatilityMarket = VolatilityMarket__factory.connect(
      addresses.TicketManager,
      signer
    );
    const tx = await volatilityMarket.verifyBet(id);

    toasts[tx.hash] = {
      txHash: tx.hash,
      message: "Transaction submitted",
      status: "info",
    };
    const timeoutId = setTimeout(() => delete toasts[tx.hash], 50000);

    tx.wait(1).then(() => {
      clearTimeout(timeoutId);
      toasts[tx.hash] = {
        txHash: tx.hash,
        message: "Transaction succeeded",
        status: "success",
      };
      setTimeout(() => delete toasts[tx.hash], 50000);
    });
  }, [id, signer]);
}

function useHandleRedeemTicket(signer: Signer | undefined, id: BigNumber) {
  return useCallback(async () => {
    if (!signer) {
      return;
    }
    const volatilityMarket = VolatilityMarket__factory.connect(
      addresses.TicketManager,
      signer
    );
    const tx = await volatilityMarket.redeemTicket(id);
    toasts[tx.hash] = {
      txHash: tx.hash,
      message: "Transaction submitted",
      status: "info",
    };
    const timeoutId = setTimeout(() => delete toasts[tx.hash], 50000);

    tx.wait(1).then(() => {
      clearTimeout(timeoutId);
      toasts[tx.hash] = {
        txHash: tx.hash,
        message: "Transaction succeeded",
        status: "success",
      };
      setTimeout(() => delete toasts[tx.hash], 50000);
    });
  }, [id, signer]);
}

function usePriceRequest(
  requester: string,
  identifier: string,
  timestamp: number,
  ancillaryData: string
) {
  const { address } = useAccount();
  const provider = useProvider();
  const oracle = OptimisticOracleV2Interface__factory.connect(
    addresses.Oracle,
    provider
  );

  const [request, setRequest] =
    useState<OptimisticOracleV2Interface.RequestStructOutput>();
  useEffect(() => {
    fetchData();
    async function fetchData() {
      try {
        if (timestamp) {
          const req = await oracle.getRequest(
            requester,
            identifier,
            timestamp,
            ancillaryData
          );
          setRequest(req);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    // only want this to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, identifier, timestamp]);

  return request;
}
