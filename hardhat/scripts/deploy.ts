import { BytesLike, Wallet } from "ethers";
import hre, { ethers } from "hardhat";
import { addresses } from "../../src/addresses";

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

  const Market = await ethers.getContractFactory("VolatilityMarket");
  const market = await Market.connect(signer).deploy(addresses.token);

  await market.deployed();
  await hre.run("verify:verify", {
    address: market.address,
    constructorArguments: [addresses.token],
  });

  return;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
