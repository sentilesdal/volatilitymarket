import { useEffect, useState } from "react";

import { BigNumber } from "ethers";
import { chainId, useAccount, useProvider } from "wagmi";

import { ERC20__factory } from "../typechain-types";

export function useTokenInfo(address: string) {
  const provider = useProvider({ chainId: chainId.goerli });
  const { address: accountAddress } = useAccount();
  const [balance, setBalance] = useState<BigNumber>();
  const [name, setName] = useState<string>();
  const [decimals, setDecimals] = useState<number>();

  useEffect(() => {
    fetchData();
    async function fetchData() {
      try {
        const token = ERC20__factory.connect(address, provider);
        if (accountAddress) {
          const tokenBalance = await token.balanceOf(accountAddress);
          setBalance(tokenBalance);
        }
        const tokenName = await token.name();
        setName(tokenName);
        const tokenDecimals = await token.decimals();
        setDecimals(tokenDecimals);
      } catch (error) {
        console.log("error", error);
      }
    }
    // only want this to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return { balance, name, decimals };
}
