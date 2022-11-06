import React from "react";
import { TicketProps } from "./App";

export function Ticket(props: TicketProps) {
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
