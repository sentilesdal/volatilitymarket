import { BigNumber } from "ethers";
import { useAccount, useContractRead } from "wagmi";
import { ERC20__factory } from "../typechain-types";

export function useAllowance(tokenAddress: string, spenderAddress: string) {
  const { address: accountAddress } = useAccount();
  const { data: allowance } = useContractRead({
    abi: ERC20__factory.abi,
    address: tokenAddress,
    functionName: "allowance",
    args: [accountAddress, spenderAddress],
  });

  return allowance as BigNumber;
}
