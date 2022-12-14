import React from "react";
import { useTickets } from "./hooks/useTickets";
import { Ticket } from "./Ticket";

export function Tickets() {
  const tickets = useTickets();
  return (
    <div className="flex flex-col w-96 text-center space-y-2">
      {tickets
        .sort((a, b) => b.betTime.toNumber() - a.betTime.toNumber())
        .map((ticket) => (
          <Ticket key={ticket.id.toHexString()} ticket={ticket} />
        ))}
    </div>
  );
}
