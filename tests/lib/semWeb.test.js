
const chai = require('chai')
const SemWeb = require('../../index.js')

const devnetAddress = '0x23a6049381fd2cfb0661d9de206613b83d53d7df'
const devnetPk = '0x302e020100300506032b657004220420acbd5f2cb2b6053f704376d12df99f2aa163d267a755c7f1d9fe55d2a2dc5405'

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

describe('SemWeb.sem', () => {
  let semWeb
  let ContractAddress = ''
  before(async () => {
    semWeb = new SemWeb(
      'http://localhost:5171/v2.4.0',
      devnetPk,
      'username', // username
      'password', // password
    )
  })

  describe('Transaction Test', () => {
    let txTransferHash = ''
    let txContractHash = ''
    describe('Get Transaction', () => {
      before(async () => {
        txTransferHash = await semWeb.sem.sendTransaction({
          from: devnetAddress,
          to: '0x74692e66fc462668f18e13eb312b30aa249bc073',
          value: 10000,
          chain: 'DEVNET',
        })
        await sleep(20000)
      })
      it('should get transaction', async () => {
        const txData = await semWeb.sem.getTransaction(txTransferHash)
        chai.assert.isObject(txData)
      })
    })
    describe('Get Transaction Result', () => {
      before(async () => {
        const contractData = '608060405234801561001057600080fd5b5060df8061001f6000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60aa565b6040518082815260200191505060405180910390f35b8060008190555050565b600080549050905600a165627a7a72305820e2b18033a6504bd07fafeb0aabf24f581bcce9542faa6f36b4637e97d5b2de450029'
        txContractHash = await semWeb.sem.createContract(
          devnetAddress,
          contractData,
          700000,
          100,
        )
        await sleep(20000)
      })
      it('should get transaction result', async () => {
        const contracRes = await semWeb.sem.getTransactionResult(txContractHash)
        chai.assert.isString(contracRes.contractAddress)
      })
    })

    describe('Get Transaction From Block', () => {
      it('should get transaction from block', async () => {
        const contractData = await semWeb.sem.getTransactionResult(txContractHash)
        const blokNumber = contractData.blockNumber
        const tx = await semWeb.sem.getTransactionFromBlock(blokNumber, 1)
        chai.assert.equal(tx.hash, txContractHash)
      })
    })

    describe('Get Transaction Limit', () => {
      it('should get transaction limits', async () => {
        const minTranasctionFee = '5000000'
        const transferLimits = await semWeb.sem.getTransactionLimits('transfer')
        chai.assert.equal(minTranasctionFee, transferLimits.minTransactionFee)
      })
    })

    describe('Get Transaction Count', () => {
      it('should get transaction count', async () => {
        const txCount = await semWeb.sem.getTransactionCount(devnetAddress)
        chai.assert.isNumber(txCount)
      })
    })

    describe('Get Pending Transaction', () => {
      before(async () => {
        await semWeb.sem.sendTransaction({
          from: devnetAddress,
          to: '0x74692e66fc462668f18e13eb312b30aa249bc073',
          value: 10000,
          chain: 'DEVNET',
        })
      })
      it('should get pending txs', async () => {
        const pendingTxs = await semWeb.sem.getPendingTransactions(devnetAddress, 0, 10)
        chai.assert.equal(pendingTxs.length, 1)
      })
    })

    describe('Get Internal Transaction', () => {
      before(async () => {
        const ABI = [{
          constant: false, inputs: [], name: 'autoSend', outputs: [], payable: true, stateMutability: 'payable', type: 'function',
        }, { payable: true, stateMutability: 'payable', type: 'fallback' }]
        const contractData = '0x608060405234801561001057600080fd5b5060c88061001f6000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680639765b4d7146041575b005b60476049565b005b3373ffffffffffffffffffffffffffffffffffffffff166108fc600234811515606e57fe5b049081150290604051600060405180830381858888f193505050501580156099573d6000803e3d6000fd5b505600a165627a7a723058201c17bc5fbe92ad70e82f652e9d79752087242a4f28f4502e13e4ceab79bf1b660029'
        const contractHash = await semWeb.sem.createContract(
          devnetAddress,
          contractData,
          200000,
          100,
        )
        await sleep(20000)
        const { contractAddress } = await semWeb.sem.getTransactionResult(contractHash)
        ContractAddress = contractAddress
        const semContract = await semWeb.contract(ABI, contractAddress)
        await semContract.autoSend().send({
          from: devnetAddress,
          value: 1e9,
        })
        await sleep(20000)
      })

      it('should get internal txs', async () => {
        const internalTxs = await semWeb.sem.getInternalTransactions(devnetAddress, 0, 10)
        chai.assert.isTrue(internalTxs.length > 0)
      })
    })
    describe('Make Local Call', () => {
      it('should make local call', async () => {
        const localCall = await semWeb.sem.getLocalCall(
          ContractAddress,
          '0x9765b4d7',
          10e9,
        )
        chai.assert.isTrue(localCall.internalTransactions.length > 0)
      })
    })
    describe('Make Local Create', () => {
      it('should make local create', async () => {
        const contractCode = '608060405234801561001057600080fd5b5060c88061001f6000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680639765b4d7146041575b005b60476049565b005b3373ffffffffffffffffffffffffffffffffffffffff166108fc600234811515606e57fe5b049081150290604051600060405180830381858888f193505050501580156099573d6000803e3d6000fd5b505600a165627a7a723058201c17bc5fbe92ad70e82f652e9d79752087242a4f28f4502e13e4ceab79bf1b660029'
        const localCreate = await semWeb.sem.getLocalCreate(contractCode)
        chai.assert.equal(localCreate.code, 'SUCCESS')
      })
    })
    describe('Compose Raw Transaction', () => {
      it('should make raw signature', async () => {
        const rawTx = await semWeb.sem.composeRawTransaction({
          chain: 'DEVNET',
          type: 'transfer',
          to: '0xbc0f0ac45c108cfb4b6b0da3bf53e2979d73fc32',
          value: 2e9,
        })
        chai.assert.isString(rawTx)
      })
    })
    describe('Verify Message', () => {
      it('should verify message', async () => {
        const signature = await semWeb.sem.signMessage(devnetAddress, 'testMessage')
        const isValid = await semWeb.sem.verifyMessage(devnetAddress, 'testMessage', signature)
        chai.assert.isTrue(isValid)
      })
    })
  })

  describe('Blokchain Test', () => {
    describe('Get Network Info', () => {
      it('should get network info', async () => {
        const networkInfo = await semWeb.sem.getNetworkInfo()
        chai.assert.isString(networkInfo.network)
      })
    })
    describe('Get Nonce', () => {
      it('should get address nonce', async () => {
        const nonce = await semWeb.sem.getNonce(devnetAddress)
        chai.assert.isNumber(parseInt(nonce, 10))
      })
    })
    describe('Get Estimate Gas', () => {
      it('should get estimate gas', async () => {
        const data = '0x9765b4d7'
        const estimateGas = await semWeb.sem.getEstimateGas(
          ContractAddress,
          1e9,
          data,
        )
        chai.assert.isString(estimateGas)
      })
    })
    describe('Get Balance', () => {
      const address = devnetAddress
      it('should get balance of address', async () => {
        const balance = await semWeb.sem.getBalance(address)
        chai.assert.isTrue(balance.available >= 0)
      })
    })
    describe('Get Delegate Votes', () => {
      it('should get votes of address', async () => {
        const votes = await semWeb.sem.getDelegateVotes(devnetAddress)
        chai.assert.isObject(votes)
      })
    })
    describe('Get Code', () => {
      it('should get contrtact code', async () => {
        const code = await semWeb.sem.getCode(ContractAddress)
        chai.assert.isString(code)
      })
    })
  })
  // --- Voting Test
  describe('Voting Test', () => {
    const voteValue = 5e9
    let newAccount = ''
    describe('Get Votes', () => {
      before(async () => {
        newAccount = await semWeb.sem.createAccount('testAddress')
        await semWeb.sem.sendTransaction({
          from: devnetAddress,
          to: newAccount,
          value: 10e9,
          chain: 'DEVNET',
        })
        await sleep(20000)
        await semWeb.sem.vote(
          newAccount,
          devnetAddress,
          voteValue,
        )
        await sleep(20000)
      })
      it('should get number of votes', async () => {
        const votes = await semWeb.sem.getVotes(newAccount)
        chai.assert.equal(votes[0].delegate.address, devnetAddress)
      })
    })
    describe('Get Vote', () => {
      it('should get the vote between a delegate and a voter', async () => {
        const votedSem = await semWeb.sem.getVote(devnetAddress, newAccount)
        chai.assert.equal(Number(votedSem), Number(voteValue))
      })
    })
    describe('Get Delegate', () => {
      it('should get number of votes', async () => {
        const delegate = await semWeb.sem.getDelegate(devnetAddress)
        chai.assert.equal(delegate.address, devnetAddress)
      })
    })
    describe('Get Delegates', () => {
      it('should get number of votes', async () => {
        const delegates = await semWeb.sem.getDelegates()
        chai.assert.isTrue(delegates.length >= 0)
      })
    })
    describe('Get Validators', () => {
      it('should get number of votes', async () => {
        const validators = await semWeb.sem.getValidators()
        chai.assert.isTrue(validators.length >= 0)
      })
    })
  })
  // --- Block related Tests
  describe('Blocks Test', () => {
    describe('Get Block', () => {
      it('should get earliest or latest block', async () => {
        let block
        const blockTypes = ['earliest', 'latest']
        // eslint-disable-next-line no-restricted-syntax
        for (const type of blockTypes) {
          // eslint-disable-next-line no-await-in-loop
          block = await semWeb.sem.getBlock(type)
          if (type === 'earliest') {
            chai.assert.isString(block.hash)
          }
          if (type === 'latest') {
            chai.assert.isNumber(Number(block.number))
          }
        }
      })
    })
    describe('Get Block By Hash', () => {
      it('should get block by hash', async () => {
        const block = await semWeb.sem.getBlock('latest')
        const blockByHash = await semWeb.sem.getBlock(block.hash)
        chai.assert.equal(block.hash, blockByHash.hash)
      })
    })
    describe('Get Block By Number', () => {
      it('should get block by number', async () => {
        const block = await semWeb.sem.getBlock('latest')
        const blockByNumber = await semWeb.sem.getBlock(Number(block.number))
        chai.assert.equal(block.number, blockByNumber.number)
      })
    })
    describe('Get Block Transaction Count', () => {
      it('should get number of txs', async () => {
        const latestBlock = await semWeb.sem.getBlock('latest')
        const txCount = await semWeb.sem.getBlockTransactionCount(Number(latestBlock.number))
        chai.assert.equal(latestBlock.transactions.length, Number(txCount))
      })
    })
    describe('Get Latest Block', () => {
      it('should return latest block', async () => {
        const latestBlock = await semWeb.sem.getLatestBlock()
        chai.assert.isString(latestBlock.hash)
      })
    })
    describe('Get Latest Block Number', () => {
      it('should return latest block number', async () => {
        const latestBlockNumber = await semWeb.sem.getBlockNumber()
        chai.assert.isNumber(latestBlockNumber)
      })
    })
  })

  describe('Private methods', () => {
    let newAccount = ''
    const voteValue = 5e9
    describe('Sign message', () => {
      it('should get signature of message', async () => {
        const signature = await semWeb.sem.signMessage(devnetAddress, 'devnetTest')
        chai.assert.isString(signature)
      })
    })
    describe('Get Accounts', () => {
      it('should get account list', async () => {
        const accountsList = await semWeb.sem.getAccounts()
        chai.assert.isTrue(accountsList.length > 1)
      })
    })
    describe('Create Account', () => {
      it('should create new account', async () => {
        const beforeAccounts = await semWeb.sem.getAccounts()
        await semWeb.sem.createAccount('createAccount')
        const afterAccounts = await semWeb.sem.getAccounts()
        chai.assert.equal(beforeAccounts.length + 1, afterAccounts.length)
      })
    })
    describe('Delete Account', () => {
      it('should delete account', async () => {
        const beforeAccounts = await semWeb.sem.getAccounts()
        const newAcc = await semWeb.sem.createAccount('deleteAccount')
        await semWeb.sem.deleteAccount(newAcc)
        const afterAccounts = await semWeb.sem.getAccounts()
        chai.assert.equal(beforeAccounts.length, afterAccounts.length)
      })
    })
    describe('Vote', () => {
      it('should make vote transaction', async () => {
        newAccount = await semWeb.sem.createAccount('voteTx')
        await semWeb.sem.sendTransaction({
          from: devnetAddress,
          to: newAccount,
          value: 10e9,
          chain: 'DEVNET',
        })
        await sleep(20000)
        await semWeb.sem.vote(
          newAccount,
          devnetAddress,
          voteValue,
        )
        await sleep(20000)
        const votes = await semWeb.sem.getVotes(newAccount)
        chai.assert.equal(votes[0].delegate.address, devnetAddress)
      })
    })
    describe('Unvote', async () => {
      it('should make unvote transaction', async () => {
        await semWeb.sem.unvote(
          newAccount,
          devnetAddress,
          voteValue,
        )
        await sleep(20000)
        const votes = await semWeb.sem.getVotes(newAccount)
        chai.assert.equal(votes.length, 0)
      })
    })
    describe('Transfer', () => {
      it('should make transfer transaction', async () => {
        const beforeBalance = await semWeb.sem.getBalance(newAccount)
        // .available
        await semWeb.sem.transfer(
          devnetAddress,
          newAccount,
          10e9,
        )
        await sleep(20000)
        const afterBalance = await semWeb.sem.getBalance(newAccount)
        chai.assert.equal(Number(beforeBalance.available) + 10e9, Number(afterBalance.available))
      })
    })
    describe('Create Delegate', () => {
      before(async () => {
        await semWeb.sem.transfer(
          devnetAddress,
          newAccount,
          1001e9,
        )
      })
      it('should register new delegate', async () => {
        const beforeDelegates = await semWeb.sem.getDelegates()
        await semWeb.sem.delegate(newAccount, 'speedrunner')
        await sleep(20000)
        const afterDelegates = await semWeb.sem.getDelegates()
        chai.assert.equal(beforeDelegates.length + 1, afterDelegates.length)
      })
    })
  })
})
