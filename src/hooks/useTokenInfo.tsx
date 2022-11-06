import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { chainId, useAccount, useProvider } from "wagmi";
import { VolatilityMarket__factory } from "../typechain-types";
import { ERC20__factory } from "../typechain-types";
import { addresses } from "../addresses";

export function useTokenInfo() {
  const provider = useProvider({ chainId: chainId.goerli });
  const { address } = useAccount();
  const volatilityMarket = VolatilityMarket__factory.connect(
    addresses.TicketManager,
    provider
  );

  const [balance, setBalance] = useState<BigNumber>();
  const [name, setName] = useState<string>();
  const [decimals, setDecimals] = useState<number>();

  useEffect(() => {
    fetchData();
    async function fetchData() {
      try {
        const tokenAddress = await volatilityMarket.token();
        const token = ERC20__factory.connect(tokenAddress, provider);
        if (address) {
          const tokenBalance = await token.balanceOf(address);
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
