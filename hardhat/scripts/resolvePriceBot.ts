import { BytesLike, Wallet } from "ethers";
import hre from "hardhat";

import { addresses } from "../../src/addresses";
import { OptimisticOracleV2Interface__factory } from "../typechain-types";

async function main() {
  const privateKey = process.env.BOT_PRIVATE_KEY as BytesLike;

  if (!privateKey) {
    console.log("no private key provided");
    return;
  }

  const wallet = new Wallet(privateKey);
  const provider = hre.ethers.getDefaultProvider();
  const signer = wallet.connect(provider);
  console.log("signer", signer.address);

  // bytes32 of 'VIX'
  const identifier =
    "0x5649580000000000000000000000000000000000000000000000000000000000";

  const oracle = OptimisticOracleV2Interface__factory.connect(
    addresses.Oracle,
    provider
  );
  const filter = oracle.filters.RequestPrice(addresses.TicketManager);
  console.log("filter", filter);

  console.log("waiting on requests for price...");
  oracle.on(
    filter,
    async (
      requester,
      _identifier,
      timestamp,
      ancillaryData,
      currency,
      reward,
      finalFee
    ) => {
      console.log("_identifier", _identifier);
      if (identifier === _identifier) {
        const priceJson = (await fetch(
          "https://api.coinbase.com/v2/exchange-rates?currency=USD"
        )) as unknown as Prices;
        console.log("priceJson", priceJson);
        const proposedPrice = 1 / +priceJson.data.rates.ETH;
        console.log("proposedPrice", proposedPrice);
        oracle
          .connect(signer)
          .proposePrice(
            requester,
            identifier,
            timestamp,
            ancillaryData,
            proposedPrice
          );
      }
      // do whatever you want here
      // I'm pretty sure this returns a promise, so don't forget to resolve it
    }
  );

  while (true) {}
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

interface Prices {
  data: {
    currency: string;
    rates: Record<string, string>;
  };
}
