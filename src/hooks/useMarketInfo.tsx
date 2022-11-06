import { useEffect, useState } from "react";

import { chainId, useProvider } from "wagmi";

import { VolatilityMarket__factory } from "../typechain-types";

export function useMarketInfo(address: string) {
  const provider = useProvider({ chainId: chainId.goerli });
  const volatilityMarket = VolatilityMarket__factory.connect(address, provider);

  const [tokenAddress, setTokenAddress] = useState("");

  useEffect(() => {
    fetchData();
    async function fetchData() {
      try {
        const tokenAddress = await volatilityMarket.token();
        setTokenAddress(tokenAddress);
      } catch (error) {
        console.log("error", error);
      }
    }
    // only want this to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return { tokenAddress };
}
