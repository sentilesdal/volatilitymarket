import React from "react";
import { formatEther } from "ethers/lib/utils";
import { useTokenInfo } from "./hooks/useTokenInfo";

export function Balance() {
  const { balance, name } = useTokenInfo();

  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text ">{`${name} balance`}</span>
      </label>
      <div className="flex flex-col align-middle justify-center input input-bordered w-full ">
        <p>{formatEther(balance || 0)}</p>
      </div>
    </div>
  );
}
