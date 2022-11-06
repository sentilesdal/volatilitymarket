import React, { useEffect } from "react";

interface ToastInfo {
  txHash: string;
}

export const toasts: Record<string, ToastInfo> = {};

interface ToasterProps {
  toasts: Record<string, ToastInfo>;
}

export function Toaster(props: ToasterProps) {
  const { toasts } = props;
  return (
    <div className="toast toast-bottom toast-end">
      {Object.values(toasts).map((toast, index) => (
        <Toast key={index} toast={{ txHash: "asdf" }} />
      ))}
    </div>
  );
}

interface ToastProps {
  toast: ToastInfo;
}
function Toast(props: ToastProps) {
  const { toast } = props;
  return (
    <div className="alert alert-success text-white">
      <div className="flex flex-col">
        <span className="text-sm">Transaction created</span>
        <span className="text-sm">{toast.txHash}</span>
      </div>
    </div>
  );
}
