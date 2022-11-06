import React from "react";

import { BigNumber } from "ethers";
import { chainId, useProvider } from "wagmi";

import { addresses } from "./addresses";
import { useTickets } from "./hooks/useTickets";
import { VolatilityMarket, VolatilityMarket__factory } from "./typechain-types";
import { TicketStruct } from "./Types";

function getAvailableFunds(
  tickets: TicketStruct[],
  volatilityMarket: VolatilityMarket
) {
  let totalAmount = BigNumber.from(0);
  const waitTime = 500000;
  tickets.forEach((ticket) => {
    if (ticket.betTime.toNumber() + waitTime < Date.now()) {
      totalAmount = totalAmount.add(ticket.amount);
    }
  });

  return totalAmount;
}

export function AvailableMoney() {
  const provider = useProvider({ chainId: chainId.goerli });
  const volatilityMarket = VolatilityMarket__factory.connect(
    addresses.TicketManager,
    provider
  );

  const tickets = useTickets();

  const totalAvailableAmount = getAvailableFunds(tickets, volatilityMarket);

  return { totalAvailableAmount };
}
