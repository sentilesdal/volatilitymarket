import React from "react";
import { useTickets } from "./hooks/useTickets";
import { Ticket } from "./Ticket";

export function Tickets() {
  const tickets = useTickets();
  return (
    <div className="flex flex-col h-full text-center space-y-2">
      {tickets.map((ticket) => (
        <Ticket key={ticket.id.toHexString()} id={ticket.id.toHexString()} />
      ))}
    </div>
  );
}
