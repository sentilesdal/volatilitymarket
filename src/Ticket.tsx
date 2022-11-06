import { formatEther } from "ethers/lib/utils";
import React from "react";

import { formatAddress } from "./formatAddress";
import { TicketStruct } from "./hooks/useTickets";

interface TicketProps {
  ticket: TicketStruct;
}

const Direction = ["none", "increase", "decrease"];

export function Ticket(props: TicketProps) {
  const { ticket } = props;
  const { id, betTime, amount, direction } = ticket;

  const created = new Date(betTime.toNumber() * 1000);

  return (
    <div className="card w-96 bg-base-100 shadow-xl p-4">
      <p className="card-title font-thin">{`Ticket ID: ${formatAddress(
        id.toHexString()
      )}`}</p>
      <p></p>

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

      <div className="card-actions justify-end">
        <button className="btn btn-primary">Verify</button>
      </div>
    </div>
  );
}
