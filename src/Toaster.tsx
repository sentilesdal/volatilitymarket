import React, { useEffect, useState } from "react";

interface ToastInfo {
  status: string;
  message: string;
  txHash: string;
}

export const toasts: Record<string, ToastInfo> = {};

interface ToasterProps {}

export function Toaster(props: ToasterProps) {
  const [_toasts, setToasts] = useState<Record<string, ToastInfo>>({});

  // total hack to poll toasts
  useEffect(() => {
    setInterval(() => {
      setToasts({ ...toasts });
    }, 1000);
  }, []);

  return (
    <div className="toast toast-bottom toast-end">
      {Object.values(toasts).map((toast, index) => (
        <Toast key={index} toast={toast} />
      ))}
    </div>
  );
}

interface ToastProps {
  toast: ToastInfo;
}
function Toast(props: ToastProps) {
  const { toast } = props;
  const className = `alert alert-${toast.status} text-white`;
  return (
    <div className={className}>
      <div className="flex flex-col">
        <span className="text-sm">{toast.message}</span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline"
          href={`https://goerli.etherscan.io/tx/${toast.txHash}`}
        >
          view on etherscan
        </a>
      </div>
    </div>
  );
}
