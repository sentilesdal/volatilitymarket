import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { chainId, useProvider } from "wagmi";
import { VolatilityMarket__factory } from "../typechain-types";
import { addresses } from "../addresses";
import { TicketStruct } from "../Types";

export function useTickets() {
  const provider = useProvider({ chainId: chainId.goerli });
  const volatilityMarket = VolatilityMarket__factory.connect(
    addresses.TicketManager,
    provider
  );

  const [tickets, setTickets] = useState<TicketStruct[]>([]);

  useEffect(() => {
    setInterval(fetchData, 1000);
    async function fetchData() {
      try {
        const filter = volatilityMarket.filters.TicketCreated();
        const result = await volatilityMarket.queryFilter(filter);
        const ids = result.map((r) => r.args.id);
        const getTickets = ids.map((id) =>
          volatilityMarket.callStatic.tickets(id)
        );
        const _tickets: TicketStruct[] = await Promise.all(getTickets);
        if (tickets.length !== _tickets.length) {
          setTickets(_tickets);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    // only want this to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return tickets;
}
