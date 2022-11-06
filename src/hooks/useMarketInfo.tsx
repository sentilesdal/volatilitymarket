import { useEffect, useState } from "react";

import { chainId, useProvider } from "wagmi";

import { VolatilityMarket__factory } from "../typechain-types";
import { useTokenBalance } from "./useTokenBalance";

export function useMarketInfo(address: string) {
  const provider = useProvider({ chainId: chainId.goerli });
  const volatilityMarket = VolatilityMarket__factory.connect(address, provider);

  const [identifier, setIdentifier] = useState("");
  const [ancillaryData, setAncillaryData] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const tvl = useTokenBalance(tokenAddress, address);

  useEffect(() => {
    fetchData();
    async function fetchData() {
      try {
        const tokenAddress = await volatilityMarket.token();
        setTokenAddress(tokenAddress);
        const id = await volatilityMarket.identifier();
        setIdentifier(id);
        const data = await volatilityMarket.ancillaryData();
        setAncillaryData(data);
      } catch (error) {
        console.log("error", error);
      }
    }
    // only want this to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return { tokenAddress, tvl, identifier, ancillaryData };
}
