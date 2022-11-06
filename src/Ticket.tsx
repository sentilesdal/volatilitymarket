import React from "react";

import { TicketProps } from "./App";
import { formatAddress } from "./formatAddress";

export function Ticket(props: TicketProps) {
  const { id } = props;
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{`Ticket ${formatAddress(id)}`}</h2>
        <p></p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Verify</button>
        </div>
      </div>
    </div>
  );
}
