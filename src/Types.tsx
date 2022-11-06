import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { chainId, useProvider } from "wagmi";

type TicketStruct = [
    BigNumber,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    number,
    boolean
  ] & {
    id: BigNumber;
    owner: string;
    betTime: BigNumber;
    verifyTime: BigNumber;
    amount: BigNumber;
    direction: number;
    claimed: boolean;
  };


  export type {TicketStruct}