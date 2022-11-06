import React from "react";
import { Signer } from "ethers";
import { useSigner } from "wagmi";
import { useHandleApprove } from "./App";

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
