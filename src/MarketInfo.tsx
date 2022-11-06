import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import React from "react";

import { addresses } from "./addresses";
import { AvailableMoney } from "./AvailableMoney";
import { formatAddress } from "./formatAddress";
import { useMarketInfo } from "./hooks/useMarketInfo";
import { useTickets } from "./hooks/useTickets";
import { useTokenInfo } from "./hooks/useTokenInfo";

export function MarketInfo() {
  const { tokenAddress, tvl, blockBuffer } = useMarketInfo(
    addresses.TicketManager
  );
  const { name } = useTokenInfo(tokenAddress);
  const { totalAvailableAmount } = AvailableMoney();
  const tickets = useTickets();
  const outstandingTickets = tickets.filter((ticket) => {
    const redeemable = !ticket.verifyTime.eq(ticket.betTime) && !ticket.claimed;
    const verifyable = ticket.verifyTime.eq(ticket.betTime);
    const expired =
      ticket.verifyTime.eq(ticket.betTime) &&
      blockBuffer &&
      ticket.betTime.toNumber() + blockBuffer < Math.floor(Date.now() / 1000);
    return (redeemable || verifyable) && !expired;
  });

  return (
    <div className="flex flex-col card w-96 bg-base-100 shadow-xl justify-items-center p-4 align-middle">
      <p className="font-thin">Market information</p>

      <div className="flex justify-between">
        <label className="label text-sm">
          <span className="label-text">{name}</span>
        </label>
        <label className="label text-sm">
          <span className="label-text">{formatAddress(tokenAddress)}</span>
        </label>
      </div>

      <div className="flex justify-between">
        <label className="label text-sm">
          <span className="label-text">Total Value Locked:</span>
        </label>
        <label className="label text-sm">
          <span className="label-text">
            {formatEther(tvl || BigNumber.from(0))}
          </span>
        </label>
      </div>

      <div className="flex justify-between">
        <label className="label text-sm">
          <span className="label-text">Claimable</span>
        </label>
        <label className="label text-sm">
          <span className="label-text">
            {formatEther(totalAvailableAmount || BigNumber.from(0))}
          </span>
        </label>
      </div>

      <div className="flex justify-between">
        <label className="label text-sm">
          <span className="label-text">Outstanding tickets:</span>
        </label>
        <label className="label text-sm">
          <span className="label-text">{outstandingTickets.length}</span>
        </label>
      </div>
    </div>
  );
}
