require('dotenv').config({ path: require('find-config')('.env') })
const { ethers } = require('ethers')
const contract = require('../artifacts/contracts/User.sol/Users.json')

const {
    API_URL,
    PRIVATE_KEY,
    PUBLIC_KEY,
    USER_CONTRACT
} = process.env

async function createTransaction(method, params) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const etherInterface = new ethers.utils.Interface(contract.abi)
    const nonce = await provider.getTransactionCount(PUBLIC_KEY, 'latest')
    const gasPrice = await provider.getGasPrice()
    const network = await provider.getNetwork()
    const { chainId } = network
    const transaction = {
        from: PUBLIC_KEY,
        to: USER_CONTRACT,
        nonce,
        chainId,
        gasPrice,
        data: etherInterface.encodeFunctionData(method, params),
    }
    return transaction
}

async function createUser(firstName, lastName) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const transaction = await createTransaction("insertUser", [firstName, lastName])
    const estimateGas = await provider.estimateGas(transaction)
    transaction["gasLimit"] = estimateGas
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const signedTx = await wallet.signTransaction(transaction)
    const transactionReceipt = await provider.sendTransaction(signedTx)
    await transactionReceipt.wait()
    const hash = transactionReceipt.hash
    console.log("transaction hash", hash)
    const receipt = await provider.getTransactionReceipt(hash)
    return receipt
}

async function getUsers() {
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const userContract = new ethers.Contract(
        USER_CONTRACT,
        contract.abi,
        provider
    )
    const result = await userContract.getUsers()
    var users = []
    result.forEach(element => {
        users.push(formatUser(element))
    })
    return users
}

async function getUser(userId) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const userContract = new ethers.Contract(
        USER_CONTRACT,
        contract.abi,
        provider
    )
    const result = await userContract.getUserById(userId)
    return formatUser(result)
}

async function updateAmount(userId, amount) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const transaction = await createTransaction("registerSale", [userId, amount])
    const estimateGas = await provider.estimateGas(transaction)
    transaction["gasLimit"] = estimateGas
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const signedTx = await wallet.signTransaction(transaction)
    const transactionReceipt = await provider.sendTransaction(signedTx)
    await transactionReceipt.wait()
    const hash = transactionReceipt.hash
    console.log("transaction hash", hash)
    const receipt = await provider.getTransactionReceipt(hash)
    return receipt
}

function formatUser(info) {
    return {
        firstName: info[0],
        lastName: info[1],
        amount: ethers.BigNumber.from(info[2]).toNumber(),
        id: ethers.BigNumber.from(info[3]).toNumber()
    }
}

module.exports = {
    getUser: getUser,
    getUsers: getUsers,
    createUser: createUser,
    updateAmount: updateAmount
}
