import { BigNumber } from "ethers";
import { useContractRead } from "wagmi";
import { ERC20__factory } from "../typechain-types";

export function useTokenBalance(tokenAddress: string, who: string) {
  const { data: balance } = useContractRead({
    abi: ERC20__factory.abi,
    address: tokenAddress,
    functionName: "balanceOf",
    args: [who],
  });
  return balance as BigNumber;
}
