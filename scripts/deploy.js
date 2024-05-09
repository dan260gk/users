const { ethers } = require("hardhat");

async function main() {
    const USERS = await ethers.getContractFactory('Users'); //cambiar dependiendo del contrato
    const users = await USERS.deploy();//cambiar dependiendo del contrato
    const txHash = users.deployTransaction.hash;
    const txReceipt = await ethers.provider.waitForTransaction(txHash);
    console.log("Contract deployed to Address:", txReceipt.contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
