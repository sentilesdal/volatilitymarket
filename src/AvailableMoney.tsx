import React from "react";
import { formatEther } from "ethers/lib/utils";
import { useTokenInfo } from "./hooks/useTokenInfo";
import { TicketStruct } from "./Types";
import { useTickets } from "./hooks/useTickets";
import { VolatilityMarket, VolatilityMarket__factory } from "./typechain-types";

import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { chainId, useProvider } from "wagmi";

import { addresses } from "./addresses";



function getAvailableFunds(tickets: TicketStruct[], volatilityMarket: VolatilityMarket){

    let totalAmount = 0
    const waitTime = 600000;
    tickets.map((ticket) => {
        if(ticket.betTime.toNumber() + waitTime < Date.now()){
            totalAmount += ticket.amount.toNumber();
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


    return {totalAvailableAmount};
}



