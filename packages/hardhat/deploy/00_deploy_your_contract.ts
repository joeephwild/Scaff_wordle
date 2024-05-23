import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys contracts named "GameContract", "WordSelector", "WordanaGame", and "RewardItem" using the deployer account
 * and constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy GameContract
  await deploy("GameContract", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed YourContract to interact with it after deploying.
  const gameContract = await hre.ethers.getContract<Contract>("GameContract", deployer);
  console.log("👋 Initial greeting from GameContract:", await gameContract.greeting());

  // Deploy WordSelector
  await deploy("WordSelector", {
    from: deployer,
    // Contract constructor arguments (if any, otherwise leave empty or customize accordingly)
    args: [],
    log: true,
    autoMine: true,
  });

  // Get the deployed WordSelector to interact with it after deploying.
  const wordSelector = await hre.ethers.getContract<Contract>("WordSelector", deployer);
  console.log("📚 WordSelector deployed at:", wordSelector.address);

  // Deploy RewardItem
  await deploy("RewardItem", {
    from: deployer,
    // Contract constructor arguments (none for RewardItem)
    args: [],
    log: true,
    autoMine: true,
  });

  // Get the deployed RewardItem to interact with it after deploying.
  const rewardItem = await hre.ethers.getContract<Contract>("RewardItem", deployer);
  console.log("🏆 RewardItem deployed at:", rewardItem.address);

  // Deploy SinglePlayer
  const tokensToEarn = 100; // Replace with actual tokens to earn
  const appkey = 'your_app_key'; // Replace with actual app key

  await deploy("SinglePlayer", {
    from: deployer,
    // Contract constructor arguments
    args: [rewardItem.address, tokensToEarn, appkey],
    log: true,
    autoMine: true,
  });

  // Get the deployed SinglePlayer to interact with it after deploying.
  const wordanaGame = await hre.ethers.getContract<Contract>("SinglePlayer", deployer);
  console.log("🎮 WordanaGame deployed at:", wordanaGame.address);
};

export default deployContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags GameContract
deployContracts.tags = ["GameContract", "WordSelector", "SinglePlayer", "RewardToken"];
