import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { useAccount, useProvider } from "wagmi";
import { addresses } from "./addresses";

import { formatAddress } from "./formatAddress";
import { useMarketInfo } from "./hooks/useMarketInfo";
import { TicketStruct } from "./Types";
import {
  OptimisticOracleV2Interface,
  OptimisticOracleV2Interface__factory,
} from "./typechain-types";

interface TicketProps {
  ticket: TicketStruct;
}

const Direction = ["none", "increase", "decrease"];

export function Ticket(props: TicketProps) {
  const { address } = useAccount();
  const { identifier, ancillaryData } = useMarketInfo(addresses.TicketManager);
  const { ticket } = props;
  const { id, betTime, amount, direction, owner } = ticket;

  const created = new Date(betTime.toNumber() * 1000);

  const priceRequest = usePriceRequest(
    ticket.owner,
    identifier,
    betTime.toNumber(),
    ancillaryData
  );

  const initialPrice = priceRequest?.resolvedPrice;

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

        <div className="flex justify-between">
          {address === owner && (
            <div className="card-actions justify-end">
              <button className="btn btn-secondary">Redeem</button>
            </div>
          )}
          {address === owner && (
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Verify</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function usePriceRequest(
  requester: string,
  identifier: string,
  timestamp: number,
  ancillaryData: string
) {
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
        const req = await oracle.getRequest(
          requester,
          identifier,
          timestamp,
          ancillaryData
        );
        setRequest(req);
      } catch (error) {
        console.log("error", error);
      }
    }
    // only want this to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return request;
}
