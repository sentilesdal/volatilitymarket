import React, { useCallback } from "react";

import { constants, Signer } from "ethers";
import { useSigner } from "wagmi";

import { addresses } from "./addresses";
import { IERC20__factory, VolatilityMarket__factory } from "./typechain-types";

export function ApproveButton() {
  const { data: signerResult } = useSigner<Signer>();
  const signer = signerResult as Signer;
  const handleApprove = useHandleApprove(signer);
  return (
    <button onClick={handleApprove} className="btn btn-primary">
      Approve
    </button>
  );
}

function useHandleApprove(signer: Signer | undefined) {
  return useCallback(async () => {
    if (!signer) {
      return;
    }
    const volatilityMarket = VolatilityMarket__factory.connect(
      addresses.TicketManager,
      signer
    );
    const tokenAddress = await volatilityMarket.token();
    const token = IERC20__factory.connect(tokenAddress, signer);
    await token.approve(addresses.TicketManager, constants.MaxUint256);
  }, [signer]);
}
