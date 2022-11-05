import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

export const { chains, provider } = configureChains(
  [chain.goerli, chain.polygon, chain.optimism, chain.arbitrum],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_ID, priority: 0 }),
    publicProvider({ priority: 1 }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Volatility Protocol",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
