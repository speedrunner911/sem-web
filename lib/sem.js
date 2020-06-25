const { Key } = require('semux-js')
const utils = require('../utils/utils.js')

const TxTypes = ['VOTE', 'UNVOTE', 'TRANSFER', 'CALL', 'CREATE', 'COINBASE', 'DELEGATE']
const ChainTypes = ['MAINNET', 'TESTNET', 'DEVNET']

class Sem {
  constructor(semWeb = false) {
    if (!semWeb) throw new Error('Expected instance of SemWeb')
    this.semWeb = semWeb
  }

  async getNetworkInfo() {
    let res
    try {
      res = await this.semWeb.fullNode.request('/info');
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getEstimateGas(to, value, hexData, gas, gasPrice) {
    let res
    if (!to) throw new Error('Recipent\'s address is required parametr')
    if (!utils.isAddress(to)) throw new Error('Invalid address provided')
    try {
      res = await this.semWeb.fullNode.request('/estimate-gas', {
        to,
        value: value || null,
        data: hexData,
        gas: gas || null,
        gasPrice: gasPrice || null,
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getLocalCall(to, hexData, value, gas, gasPrice) {
    let res
    if (!to) throw new Error('Recipent\'s address is required parametr')
    if (!utils.isAddress(to)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/local-call', {
        to,
        value: value || null,
        data: hexData,
        gas: gas || null,
        gasPrice: gasPrice || null,
      })
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getLocalCreate(hexData, value, gas, gasPrice) {
    let res
    try {
      res = await this.semWeb.fullNode.request('/local-create', {
        value: value || null,
        data: hexData || null,
        gas: gas || null,
        gasPrice: gasPrice || null,
      })
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async composeRawTransaction(txObject = {}) {
    let res
    const { to, value } = txObject.to
    const chain = txObject.chain.toUpperCase()
    const type = txObject.type.toUpperCase()
    const hexData = txObject.data || '0x00'
    const nonce = txObject.nonce || null
    const timestamp = txObject.timestamp || null
    const gas = txObject.gas || null
    const gasPrice = txObject.gasPrice || null
    const fee = txObject.fee || null

    if (!to || !utils.isAddress(to)) throw new Error('Invalid reciever address')
    if (!utils.isInteger(value) || value === 0) throw new Error('Invalid amount provided')
    if (!ChainTypes.includes(chain)) throw new Error('Invalid network type')
    if (!TxTypes.includes(type.toUpperCase())) throw new Error('Error, wrong transaction type')
    if (!utils.isInteger(timestamp)) throw new Error('Invalid timestamp value')
    if (!utils.isInteger(gas) || !utils.isInteger(gasPrice)) throw new Error('Invalid gas or gasPrice value')
    if (!utils.isInteger(nonce)) throw new Error('Invalid nonce value')
    if (!utils.isHex(hexData)) throw new Error('Invalid data value')
    try {
      res = await this.semWeb.fullNode.request('/compose-raw-transaction', {
        chain,
        type,
        to,
        value,
        fee,
        nonce,
        timestamp,
        hexData,
        gas,
        gasPrice,
      })
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async broadcasRawTransaction(raw = '0x') {
    let res
    if (!raw) throw new Error('Raw transaction is required')
    if (!utils.isHex(raw)) throw new Error('Raw need to be valid hexadecimal string')

    try {
      res = await this.semWeb.fullNode.request('/broadcast-raw-transaction', {
        raw,
      })
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getBalance(address = '0x0') {
    let res
    if (!address) throw new Error('Address is required')
    if (!utils.isAddress(address)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/account', {
        address: String(address),
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getVotes(address = '0x0') {
    let res
    if (!address) throw new Error('Address is required')
    if (!utils.isAddress(address)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/account/votes', {
        address: String(address),
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getCode(address = '0x0') {
    let res
    if (!address) throw new Error('Address is required')
    if (!utils.isAddress(address)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/account/code', {
        address: String(address),
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  // account
  // need to move to .account
  async getPendingTransactions(address = '0x0', from = 0, to = 10) {
    let res
    if (!address) throw new Error('Address is required')
    if (!utils.isAddress(address)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/account/pending-transactions', {
        address: String(address),
        from,
        to,
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  // basic
  async getBasicPendingTransactions() {
    let res
    try {
      res = await this.semWeb.fullNode.request('/pending-transactions', 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getInternalTransactions(address = '0x0', from = 0, to = 10) {
    let res
    if (!address) throw new Error('Address is required')
    if (!utils.isAddress(address)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/account/internal-transactions', {
        address: String(address),
        from,
        to,
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getTransactions(address = '0x0', from = 0, to = 10) {
    let res
    if (!address) throw new Error('Address is required')
    if (!from || !to) throw new Error('From and to value are required')
    if (!utils.isAddress(address)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/account/transactions', {
        address: String(address),
        from,
        to,
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getStorage(address = '0x0', position = '0x') {
    let res
    if (!address) throw new Error('Address is required')
    if (!utils.isAddress(address)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/account/storage', {
        address: String(address),
        key: position.toString(16),
      })
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getTransaction(txHash = '0x0') {
    let res
    if (!txHash) throw new Error('Transaction hash is required')
    if (!this.semWeb.utils.isHexStrict(txHash)) throw new Error('Invalid hash provided')

    try {
      res = await this.semWeb.fullNode.request('/transaction', {
        hash: String(txHash),
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getTransactionResult(txHash = '0x0') {
    let res
    if (!txHash) throw new Error('Transaction hash is required')
    if (!this.semWeb.utils.isHexStrict(txHash)) throw new Error('Invalid hash provided')

    try {
      res = await this.semWeb.fullNode.request('/transaction-result', {
        hash: String(txHash),
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getTransactionCount(address = '0x0') {
    let res
    if (!address) throw new Error('Address is required')
    if (!utils.isAddress(address)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/account', {
        address: String(address),
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result.transactionCount || null
  }

  async getTransactionFromBlock(block = 0, index = 0) {
    if (!block) throw new Error('Block number is required')
    if (!utils.isInteger(block)) throw new Error('Block number need to be an integer')
    // can use block hash and block number
    const blockData = await this.getBlock(block)
    if (!blockData) throw new Error('Api error')
    return blockData.transactions[index] || null
  }

  async getBlockTransactionCount(block = 0) {
    if (!block) throw new Error('Block number is required')
    const blockData = await this.getBlock(block)
    if (!blockData) throw new Error('Api error')
    return blockData.transactions.length || null
  }

  async getTransactionLimits(type) {
    let res
    if (!utils.isString(type)) throw new Error('Wrong type specified')
    if (!TxTypes.includes(type.toUpperCase())) throw new Error('Error, wrong transaction type')

    try {
      res = await this.semWeb.fullNode.request('/transaction-limits', {
        type: type.toUpperCase(),
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  getBlock(block) {
    if (!block) throw new Error('Block number is required')
    if (block === false) throw new Error('No block identifier provided')
    if (block === 'earliest') {
      // eslint-disable-next-line no-param-reassign
      block = 1;
    }
    if (block === 'latest') {
      return this.getLatestBlock()
    }
    if (utils.isHex(block)) return this.getBlockByHash(block)
    return this.getBlockByNumber(block)
  }

  async getBlockByNumber(blockNumber = 0) {
    let res
    if (!blockNumber) throw new Error('Block number is required')
    if (!utils.isInteger(blockNumber)) throw new Error('Block number must be an integer')

    try {
      res = await this.semWeb.fullNode.request('/block-by-number', {
        number: parseInt(blockNumber, 10),
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getBlockByHash(blockHash = '0x') {
    let res
    if (!blockHash) throw new Error('Block hash is required')

    try {
      res = await this.semWeb.fullNode.request('/block-by-hash', {
        hash: String(blockHash),
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getLatestBlock() {
    let res
    try {
      res = await this.semWeb.fullNode.request('/latest-block')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getBlockNumber() {
    const latestBlockData = await this.getLatestBlock()
    return Number(latestBlockData.number)
  }

  async verifyMessage(address = '0x0', message, signature) {
    let res
    let mes
    let sig
    if (!address || !message || !signature) throw new Error('Address, message and signature params are required')
    if (message.substr(0, 2) === '0x') mes = message.substr(2)
    if (signature.substr(0, 2) === '0x') sig = signature.substr(2)

    try {
      res = await this.semWeb.fullNode.request('/verify-message', {
        address,
        message: mes || message,
        signature: sig || signature,
      }, 'get')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.valid
  }

  async sendRawTransaction(signedTranasction = false) {
    return this.sendRawTransaction(signedTranasction)
  }

  async getNonce(address = '0x') {
    let res
    if (!address) throw new Error('Address is required')
    if (!utils.isAddress(address)) throw new Error('Invalid address provided')

    try {
      res = await this.getBalance(address)
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res) throw new Error('Api error')
    return res.nonce
  }
  // need private key from node

  async sendTransaction(txObject = {}) {
    let result
    const { to, value } = txObject
    const from = txObject.from || null
    const data = txObject.data || '0x'
    const nonce = txObject.nonce || null
    const chain = txObject.chain.toUpperCase() || 'MAINNET'
    const type = txObject.type || 'TRANSFER'

    if (!to || !utils.isAddress(to)) throw new Error('Invalid reciever address')
    if (!utils.isInteger(value) || value === 0) throw new Error('Invalid amount provided')
    if (!ChainTypes.includes(chain)) throw new Error('Invalid network type')
    if (!TxTypes.includes(type.toUpperCase())) throw new Error('Error, wrong transaction type')

    try {
      const transaction = await this.semWeb.transactionBuilder.sendSem(
        from, to, value, data, nonce, type, chain,
      )
      const signedTranasction = await this.sign(transaction, this.semWeb.defaultPrivateKey)
      result = await this.sendSignedTransaction(signedTranasction)
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    return result
  }

  async sendSignedTransaction(signedTranasction) {
    let res
    if (!signedTranasction.signature) throw new Error('Transaction is not signed')
    const serialize = Buffer.from(signedTranasction.toBytes().buffer).toString('hex')
    try {
      res = await this.semWeb.fullNode.request('/broadcast-raw-transaction', {
        raw: serialize,
        validateNonce: true,
      })
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async sign(transaction = false, privateKey = this.semWeb.defaultPrivateKey) {
    if (transaction.signature) throw new Error('Transaction is already signed')
    const encodedPK = Key.importEncodedPrivateKey(utils.hexBytes(privateKey))
    return transaction.sign(encodedPK)
  }

  // Delegate Part of API Calls
  async getDelegate(address = '0x') {
    let res
    if (!address) throw new Error('Address is required')
    if (!utils.isAddress(address)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/delegate', { address })
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getDelegates() {
    let res
    try {
      res = await this.semWeb.fullNode.request('/delegates')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getValidators() {
    let res
    try {
      res = await this.semWeb.fullNode.request('/validators')
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getVote(delegate = '0x', voter = '0x') {
    let res
    if (!delegate || !voter) throw new Error('Delegate and voter address is required')
    if (!utils.isAddress(delegate) || !this.semWeb.utils.isAddress(voter)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/vote', {
        delegate,
        voter,
      })
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async getDelegateVotes(delegate = '0x') {
    let res
    if (!delegate) throw new Error('Delegate address is required')
    if (!utils.isAddress(delegate)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/votes', {
        delegate,
      })
    } catch (e) {
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  // Auth Require Methods
  async getAccounts() {
    let res
    try {
      res = await this.semWeb.fullNode.request('/accounts');
    } catch (e) {
      if (e.response.status === 401) throw new Error('Error, you need to specify username and password to make auth requests')
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async createAccount(name = '', privateKey = '') {
    let res
    if (privateKey) {
      if (!utils.isHexStrict(privateKey)) throw new Error('Wrong private key, try another one')
    }
    try {
      res = await this.semWeb.fullNode.request('/create-account', {
        name: name || null,
        privateKey: privateKey || null,
      }, 'post')
    } catch (e) {
      if (e.response.status === 401) throw new Error('Error, you need to specify username and password to make auth requests')
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async deleteAccount(address = '0x') {
    let res
    if (!address) throw new Error('Address is required')
    if (!utils.isAddress(address)) throw new Error('Invalid address provided')
    try {
      res = await this.semWeb.fullNode.request('/delete-account', {
        address,
      }, 'post')
    } catch (e) {
      if (e.response.status === 401) throw new Error('Error, you need to specify username and password to make auth requests')
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return true
  }

  async signMessage(address = '0x0', message) {
    let res
    if (!address || !message) throw new Error('Address and message are required')
    if (!utils.isAddress(address)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/sign-message', {
        address,
        message,
      }, 'post')
    } catch (e) {
      if (e.response.status === 401) throw new Error('Error, you need to specify username and password to make auth requests')
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  // TO DO combine vote, unvote and transfer in 1 function?
  async vote(from = '0x', to = '0x', value = 0, fee, nonce) {
    let res
    if (!from || !to || !value) throw new Error('From, to and value params are required')
    if (!utils.isAddress(from) || !utils.isAddress(to)) throw new Error('Invalid address provided')
    if (!utils.isInteger(value)) throw new Error('Invalid value is provided')

    try {
      res = await this.semWeb.fullNode.request('/transaction/vote', {
        from,
        to,
        value,
        fee: fee || null,
        nonce: nonce || null,
      }, 'post')
    } catch (e) {
      if (e.response.status === 401) throw new Error('Error, you need to specify username and password to make auth requests')
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async unvote(from = '0x', to = '0x', value = 0, fee, nonce) {
    let res
    if (!from || !to || !value) throw new Error('From, to and value params are required')
    if (!utils.isAddress(from) || !utils.isAddress(to)) throw new Error('Invalid address provided')
    if (!utils.isInteger(value)) throw new Error('Invalid value is provided')

    try {
      res = await this.semWeb.fullNode.request('/transaction/unvote', {
        from,
        to,
        value,
        fee: fee || null,
        nonce: nonce || null,
      }, 'post')
    } catch (e) {
      if (e.response.status === 401) throw new Error('Error, you need to specify username and password to make auth requests')
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async transfer(from = '0x', to = '0x', value = 0, fee, nonce) {
    let res
    if (!from || !to || !value) throw new Error('From, to and value params are required')
    if (!utils.isAddress(from) || !utils.isAddress(to)) throw new Error('Invalid address provided')
    if (!utils.isInteger(value)) throw new Error('Invalid value is provided')

    try {
      res = await this.semWeb.fullNode.request('/transaction/transfer', {
        from,
        to,
        value,
        fee: fee || null,
        nonce: nonce || null,
      }, 'post')
    } catch (e) {
      if (e.response.status === 401) throw new Error('Error, you need to specify username and password to make auth requests')
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async delegate(from = '0x', data = '0x', fee, nonce) {
    let res
    if (!from || !data) throw new Error('From and data params are required')
    if (!utils.isAddress(from)) throw new Error('Invalid address provided')

    try {
      res = await this.semWeb.fullNode.request('/transaction/delegate', {
        from,
        data: utils.toHex(data),
        fee: fee || null,
        nonce: nonce || null,
      }, 'post')
    } catch (e) {
      if (e.response.status === 401) throw new Error('Error, you need to specify username and password to make auth requests')
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  async createContract(from = '0x', data, gas, gasPrice, value, nonce) {
    let res
    if (!from || !data || !gas || !gasPrice) throw new Error('From, data, gas and gasPrice params are required')
    if (!utils.isAddress(from)) throw new Error('Invalid address provided')
    if (!utils.isInteger(gas) || !utils.isInteger(gasPrice)) throw new Error('Invalid gas or gasPrice provided')

    try {
      res = await this.semWeb.fullNode.request('/transaction/create', {
        from,
        data,
        gas,
        gasPrice,
        value: value || null,
        nonce: nonce || null,
      }, 'post')
    } catch (e) {
      if (e.response.status === 401) throw new Error('Error, you need to specify username and password to make auth requests')
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }

  // maybe make an object param?
  async callContract(from = '0x', to = '0x', gas, gasPrice = 100, data, value, nonce) {
    let res
    if (!from || !to || !gas || !gasPrice) throw new Error('From, to, gas and gasPrice params are required')
    if (!utils.isAddress(from) || !utils.isAddress(to)) throw new Error('Invalid address provided')
    if (!utils.isInteger(gas) || !utils.isInteger(gasPrice)) throw new Error('Invalid gas or gasPrice provided')

    try {
      res = await this.semWeb.fullNode.request('/transaction/call', {
        from,
        to,
        gas,
        gasPrice,
        data: data || null,
        value: value || null,
        nonce: nonce || null,
      }, 'post')
    } catch (e) {
      if (e.response.status === 401) throw new Error('Error, you need to specify username and password to make auth requests')
      throw new Error(e.response.data.message)
    }
    if (!res || !res.data || !res.data.success) throw new Error('Api error')
    return res.data.result
  }
}

module.exports = Sem
