
const EventEmitter = require('eventemitter3')
const { Key } = require('semux-js')
const HttpProvider = require('./lib/HttpProvider.js')
const utils = require('./utils/utils')

const TransactionBuilder = require('./lib/transactionBuilder.js')
const Contract = require('./lib/Contract.js')
const Sem = require('./lib/sem.js')

class SemWeb extends EventEmitter {
  constructor(fullNode, privateKey = false, username = '', password = '') {
    super()
    let newFullNode
    if (utils.isString(fullNode)) {
      newFullNode = new HttpProvider(fullNode, username, password)
    }
    this.transactionBuilder = new TransactionBuilder(this);
    this.address = SemWeb['address']
    this.sem = new Sem(this)
    this.utils = utils

    this.defaultBlock = false
    this.defaultPrivateKey = false
    this.defaultAddress = {
      hex: false,
      base58: false,
    };
    if (privateKey) this.setPrivateKey(privateKey)
    this.fullNode = newFullNode
  }

  setPrivateKey(privateKey) {
    if (!privateKey) throw new Error('Invalid private key')
    const key = Key.importEncodedPrivateKey(utils.hexBytes(privateKey))
    const address = `0x${key.toAddressHexString()}`
    try {
      this.setAddress(address)
    } catch (e) {
      throw new Error('Invalid private key provided');
    }
    this.defaultPrivateKey = privateKey;
  }

  setAddress(address) {
    if (!address) throw new Error('Invalid address')
    this.defaultAddress = address
  }

  setFullNode(fullNode) {
    this.fullNode = fullNode;
  }

  contract(abi = [], contractAddress = '') {
    return new Contract(this, abi, contractAddress)
  }
}

module.exports = SemWeb
